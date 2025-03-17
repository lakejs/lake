import { isKeyHotkey } from 'is-hotkey';
import { TranslationFunctions } from '../i18n/types';
import { BoxComponent, BoxType } from '../types/box';
import { icons } from '../icons';
import { query } from '../utils/query';
import { template } from '../utils/template';
import { Box } from '../models/box';
import { Button } from '../ui/button';
import { CornerToolbar } from '../ui/corner-toolbar';
import { Resizer } from '../ui/resizer';

/**
 * Configuration object that defines the iframe box behavior and appearance.
 */
interface IframeBoxConfig {
  /**
   * The type of the box.
   */
  type: BoxType;
  /**
   * The name of the iframe box component.
   */
  name: string;
  /**
   * The default width of the iframe.
   */
  width: string;
  /**
   * The default height of the iframe.
   */
  height: string;
  /**
   * Description text for the form, which can be localized.
   */
  formDescription: string | ((locale: TranslationFunctions) => string);
  /**
   * Label for the URL input field, which can be localized.
   */
  urlLabel?: string | ((locale: TranslationFunctions) => string);
  /**
   * Placeholder text for the URL input field.
   */
  urlPlaceholder: string;
  /**
   * Text for the embed button, which can be localized.
   */
  embedButtonText: string | ((locale: TranslationFunctions) => string);
  /**
   * Tooltip text for the delete button, which can be localized.
   */
  deleteButtonText: string | ((locale: TranslationFunctions) => string);
  /**
   * Function to validate the inputted URL.
   */
  validUrl: (url: string) => boolean;
  /**
   * Error message shown if URL validation fails.
   */
  urlError: string | ((locale: TranslationFunctions) => string);
  /**
   * Placeholder text shown while the iframe is loading.
   */
  iframePlaceholder?: string;
  /**
   * Function to generate attributes for the iframe element.
   */
  iframeAttributes: (url: string) => Record<string, string>;
  /**
   * Callback executed before the iframe loads.
   */
  beforeIframeLoad?: (box: Box) => void;
  /**
   * If true, allows resizing of the iframe.
   */
  resize?: boolean;
}

/**
 * Returns the localized string.
 */
function getLocaleString(
  locale: TranslationFunctions,
  value: string | ((locale: TranslationFunctions) => string),
): string {
  return typeof value === 'string' ? value : value(locale);
}

/**
 * Appends a corner toolbar to the iframe box.
 */
function appendCornerToolbar(config: IframeBoxConfig, box: Box): void {
  const editor = box.getEditor();
  const boxContainer = box.getContainer();
  const rootNode = boxContainer.find('.lake-iframe');
  if (rootNode.find('.lake-corner-toolbar').length > 0) {
    return;
  }
  new CornerToolbar({
    locale: editor.locale,
    root: rootNode,
    items: [
      {
        name: 'remove',
        icon: icons.get('remove'),
        tooltip: config.deleteButtonText,
        onClick: event => {
          event.stopPropagation();
          editor.selection.removeBox(box);
          editor.history.save();
        },
      },
    ],
  }).render();
}

/**
 * Shows the iframe in the box.
 */
function showIframe(config: IframeBoxConfig, box: Box): void {
  const editor = box.getEditor();
  const boxContainer = box.getContainer();
  const value = box.value;
  const width = value.width || config.width;
  const height = value.height || config.height;
  const iframeNode = query('<iframe></iframe>');
  iframeNode.css({
    width,
    height,
  });
  const iframeAttributes = config.iframeAttributes(value.url);
  for (const key of Object.keys(iframeAttributes)) {
    iframeNode.attr(key, iframeAttributes[key]);
  }
  const placeholderNode = query('<div class="lake-iframe-placeholder" />');
  placeholderNode.css({
    width,
    height,
  });
  if (config.iframePlaceholder) {
    placeholderNode.append(config.iframePlaceholder);
  }
  const rootNode = boxContainer.find('.lake-iframe');
  iframeNode.on('load', () => {
    placeholderNode.remove();
    if (editor.readonly) {
      return;
    }
    if (config.resize === true && rootNode.find('.lake-resizer').length === 0) {
      new Resizer({
        root: rootNode,
        target: iframeNode,
        onStop: (newWidth, newHeight) => {
          box.updateValue({
            width: `${newWidth}px`,
            height: `${newHeight}px`,
          });
          editor.history.save();
        },
      }).render();
    }
  });
  if (config.validUrl(value.url)) {
    rootNode.prepend(iframeNode);
  } else {
    placeholderNode.css('position', 'static');
  }
  rootNode.prepend(placeholderNode);
  if (config.beforeIframeLoad) {
    config.beforeIframeLoad(box);
  }
}

/**
 * Creates an iframe box component with configurable properties.
 * This component supports rendering an iframe with customizable attributes, resizing, and toolbar functionalities.
 */
export function createIframeBox(config: IframeBoxConfig): BoxComponent {
  return {
    type: config.type,
    name: config.name,
    render: box => {
      const editor = box.getEditor();
      const locale = editor.locale;
      const value = box.value;
      const boxContainer = box.getContainer();
      const rootNode = query('<div class="lake-iframe" />');
      boxContainer.empty();
      boxContainer.append(rootNode);
      if (value.url === undefined) {
        if (editor.readonly) {
          box.node.hide();
          return;
        }
        const formNode = config.type === 'inline'
          ? query(template`
            <div class="lake-iframe-form">
              <div class="lake-description">${getLocaleString(locale, config.formDescription)}</div>
              <div class="lake-input-label">${getLocaleString(locale, config.urlLabel || '')}</div>
              <div class="lake-input-field">
                <input type="text" name="url" placeholder="${config.urlPlaceholder}" />
              </div>
              <div class="lake-button-field"></div>
            </div>
          `)
          : query(template`
            <div class="lake-iframe-form">
              <div class="lake-description">${getLocaleString(locale, config.formDescription)}</div>
              <div class="lake-input-field">
                <input type="text" name="url" placeholder="${config.urlPlaceholder}" />
                <div class="lake-button-field"></div>
              </div>
            </div>
          `);
        const button = new Button({
          root: formNode.find('.lake-button-field'),
          name: 'embed',
          type: 'primary',
          text: getLocaleString(locale, config.embedButtonText),
          onClick: () => {
            const url = formNode.find('input[name="url"]').value();
            if (!config.validUrl(url)) {
              editor.config.onMessage('error', getLocaleString(locale, config.urlError));
              return;
            }
            box.updateValue('url', url);
            editor.history.save();
            formNode.remove();
            showIframe(config, box);
          },
        });
        formNode.find('input[name="url"]').on('keydown', event => {
          if (isKeyHotkey('enter', event as KeyboardEvent)) {
            event.preventDefault();
            button.node.emit('click');
          }
        });
        button.render();
        rootNode.append(formNode);
      } else {
        showIframe(config, box);
      }
      if (!editor.readonly) {
        appendCornerToolbar(config, box);
      }
    },
  };
}
