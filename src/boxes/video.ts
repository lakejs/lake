import { isKeyHotkey } from 'is-hotkey';
import { BoxComponent } from '../types/box';
import { icons } from '../icons';
import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';
import { Box } from '../models/box';
import { Button } from '../ui/button';
import { BoxResizer } from '../ui/box-resizer';

function getVideoId(url: string): string {
  const result = /\w+$/i.exec(url || '');
  return result ? result[0] : '';
}

function appendButtonGroup(box: Box): void {
  const editor = box.getEditor();
  const boxContainer = box.getContainer();
  const videoNode = boxContainer.find('.lake-video');
  const buttonGroupNode = query(safeTemplate`
    <div class="lake-button-group">
      <button type="button" tabindex="-1" class="lake-button-remove" title="${editor.locale.video.remove()}"></button>
    </div>
  `);
  const removeButton = buttonGroupNode.find('.lake-button-remove');
  const removeIcon = icons.get('remove');
  if (removeIcon) {
    removeButton.append(removeIcon);
  }
  buttonGroupNode.find('.lake-button-remove').on('click', event => {
    event.stopPropagation();
    editor.selection.removeBox(box);
    editor.history.save();
  });
  videoNode.append(buttonGroupNode);
}

function showVideo(box: Box): void {
  const editor = box.getEditor();
  const boxContainer = box.getContainer();
  const value = box.value;
  const width = value.width || 560;
  const height = value.height || 315;
  boxContainer.css({
    width: `${width}px`,
    height: `${height}px`,
  });
  const videoId = getVideoId(value.url);
  if (videoId === '') {
    throw new Error(`Invalid link: ${value.url}`);
  }
  // YouTube URL: https://www.youtube.com/watch?v=5sMBhDv4sik
  // The script for embedding YouTube:
  // <iframe width="560" height="315" src="https://www.youtube.com/embed/5sMBhDv4sik" title="YouTube video player"
  // frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  // referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  const iframeNode = query(safeTemplate`
    <iframe width="100%" height="${height}" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player"
      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  `);
  const rootNode = boxContainer.find('.lake-video');
  if (!editor.readonly) {
    iframeNode.on('load', () => {
      appendButtonGroup(box);
      new BoxResizer({
        root: rootNode,
        box,
        width,
        height,
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
    });
  }
  rootNode.append(iframeNode);
}

export default {
  type: 'inline',
  name: 'video',
  render: box => {
    const editor = box.getEditor();
    const locale = editor.locale;
    const value = box.value;
    const boxContainer = box.getContainer();
    const rootNode = query('<div class="lake-video" />');
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
      const formNode = query(safeTemplate`
        <div class="lake-video-form">
          <div class="lake-row lake-desc-row">${locale.video.description()}</div>
          <div class="lake-row">${locale.video.url()}</div>
          <div class="lake-row">
            <input type="text" name="url" placeholder="https://www.youtube.com/watch?v=..." />
          </div>
          <div class="lake-row lake-button-row"></div>
        </div>
      `);
      const button = new Button({
        root: formNode.find('.lake-button-row'),
        name: 'embed',
        type: 'primary',
        text: locale.video.embed(),
        onClick: () => {
          const url = formNode.find('input[name="url"]').value();
          if (url.indexOf('https://www.youtube.com/') < 0 || getVideoId(url) === '') {
            editor.config.onMessage('error', locale.video.urlError());
            return;
          }
          box.updateValue('url', url);
          editor.history.save();
          formNode.remove();
          showVideo(box);
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
      appendButtonGroup(box);
    } else {
      showVideo(box);
    }
  },
} as BoxComponent;
