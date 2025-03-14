import { isKeyHotkey } from 'is-hotkey';
import { TranslationFunctions } from '../i18n/types';
import { BoxComponent, BoxType } from '../types/box';
import { icons } from '../icons';
import { query } from '../utils/query';
import { template } from '../utils/template';
import { Nodes } from '../models/nodes';
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
  width: number;
  /**
   * The default height of the iframe.
   */
  height?: number;
  /**
   * Description text for the form, which can be localized.
   */
  formDescription: string | ((locale: TranslationFunctions) => string);
  /**
   * Label for the URL input field, which can be localized.
   */
  formLabel: string | ((locale: TranslationFunctions) => string);
  /**
   * Placeholder text for the URL input field.
   */
  formPlaceholder: string;
  /**
   * Text for the submit button, which can be localized.
   */
  formButtonText: string | ((locale: TranslationFunctions) => string);
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
   * SVG icon for the iframe.
   */
  iframePlaceholder?: string;
  /**
   * Function to generate attributes for the iframe element.
   */
  iframeAttributes: (url: string) => Record<string, string>;
  /**
   * Callback executed before the iframe loads.
   */
  beforeIframeLoad?: (iframeNode: Nodes) => void;
  /**
   * If true, allows resizing of the iframe.
   */
  resize?: boolean;
}

function getLocaleString(locale: TranslationFunctions, value: string | ((locale: TranslationFunctions) => string)): string {
  return typeof value === 'string' ? value : value(locale);
}

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

function showIframe(config: IframeBoxConfig, box: Box): void {
  const editor = box.getEditor();
  const boxContainer = box.getContainer();
  const value = box.value;
  const width = value.width || config.width;
  const height = value.height || config.height;
  if (config.resize === true) {
    boxContainer.css({
      width: `${width}px`,
      height: `${height}px`,
    });
  }
  const iframeNode = query('<iframe></iframe>');
  if (config.resize === true) {
    iframeNode.attr('width', '100%');
  } else {
    iframeNode.attr('width', width.toString());
  }
  if (height) {
    iframeNode.attr('height', height.toString());
  }
  const iframeAttributes = config.iframeAttributes(value.url);
  for (const key of Object.keys(iframeAttributes)) {
    iframeNode.attr(key, iframeAttributes[key]);
  }
  if (config.beforeIframeLoad) {
    config.beforeIframeLoad(iframeNode);
  }
  const placeholderNode = query('<div class="lake-iframe-placeholder" />');
  if (config.iframePlaceholder) {
    placeholderNode.append(config.iframePlaceholder);
  }
  const rootNode = boxContainer.find('.lake-iframe');
  iframeNode.on('load', () => {
    placeholderNode.remove();
    if (editor.readonly) {
      return;
    }
    appendCornerToolbar(config, box);
    if (config.resize === true) {
      new Resizer({
        root: rootNode,
        target: boxContainer,
        onResize: (newWidth, newHeight) => {
          iframeNode.attr({
            height: newHeight.toString(),
          });
        },
        onStop: (newWidth, newHeight) => {
          box.updateValue({
            width: newWidth,
            height: newHeight,
          });
          editor.history.save();
        },
      }).render();
    }
  });
  rootNode.prepend(iframeNode);
  placeholderNode.css({
    width: `${iframeNode.width()}px`,
    height: `${iframeNode.height()}px`,
  });
  rootNode.prepend(placeholderNode);
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
      boxContainer.css({
        width: '',
        height: '',
      });
      boxContainer.append(rootNode);
      if (!value.url) {
        if (editor.readonly) {
          box.node.hide();
          return;
        }
        const formNode = query(template`
          <div class="lake-iframe-form">
            <div class="lake-row lake-desc-row">${getLocaleString(locale, config.formDescription)}</div>
            <div class="lake-row">${getLocaleString(locale, config.formLabel)}</div>
            <div class="lake-row">
              <input type="text" name="url" placeholder="${config.formPlaceholder}" />
            </div>
            <div class="lake-row lake-button-row"></div>
          </div>
        `);
        const button = new Button({
          root: formNode.find('.lake-button-row'),
          name: 'embed',
          type: 'primary',
          text: getLocaleString(locale, config.formButtonText),
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
        appendCornerToolbar(config, box);
      } else {
        showIframe(config, box);
      }
    },
  };
}
