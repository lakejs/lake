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

interface CreateIframeBoxConfig {
  type: BoxType;
  name: string;
  width: number;
  height?: number;
  formDescription: string | ((locale: TranslationFunctions) => string);
  formLabel: string | ((locale: TranslationFunctions) => string);
  formPlaceholder: string;
  formButtonText: string | ((locale: TranslationFunctions) => string);
  deleteButtonText: string | ((locale: TranslationFunctions) => string);
  validUrl: (url: string) => boolean;
  urlError: string | ((locale: TranslationFunctions) => string);
  iframeAttributes: (url: string) => Record<string, string>;
  beforeIframeLoad?: (iframeNode: Nodes) => void;
  resize?: boolean;
}

function getLocaleString(locale: TranslationFunctions, value: string | ((locale: TranslationFunctions) => string)): string {
  return typeof value === 'string' ? value : value(locale);
}

function appendCornerToolbar(config: CreateIframeBoxConfig, box: Box): void {
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

function showIframe(config: CreateIframeBoxConfig, box: Box): void {
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
  const rootNode = boxContainer.find('.lake-iframe');
  if (!editor.readonly) {
    iframeNode.on('load', () => {
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
  }
  rootNode.prepend(iframeNode);
}

/**
 * Creates an iframe box component.
 */
export function createIframeBox(config: CreateIframeBoxConfig): BoxComponent {
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
