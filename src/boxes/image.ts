import type { BoxComponent, BoxValue } from '../types/box';
import { icons } from '../icons';
import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';
import { Nodes } from '../models/nodes';

// Loads an image and get its width and height.
function loadImage(
  url: string,
  onLoad: (node: Nodes, width: number, height: number) => void,
  onError: (node: Nodes) => void,
): void {
  const imgNode = query('<img />');
  imgNode.css({
    position: 'absolute',
    top: '0',
    left: '-8888px',
    'z-index': '-1',
    visibility: 'hidden',
  });
  imgNode.on('load', () => {
    const imgNativeNode = imgNode.get(0) as HTMLImageElement;
    const width = imgNativeNode.width;
    const height = imgNativeNode.height;
    imgNode.remove();
    imgNode.removeAttr('style');
    onLoad(imgNode, width, height);
  });
  imgNode.on('error', () => {
    imgNode.remove();
    onError(imgNode);
  });
  imgNode.attr('src', url);
  query(document.body).append(imgNode);
}

// Displays an image with uplaoding progress.
function renderUploading(root: Nodes, value: BoxValue): void {
  const progressNode = query('<div class="lake-progress"><div class="lake-percent">0 %</div></div>');
  const circleNotchIcon = icons.get('circleNotch');
  if (circleNotchIcon) {
    progressNode.prepend(circleNotchIcon);
  }
  root.append(progressNode);
  loadImage(value.url, (imgNode, width, height) => {
    imgNode.addClass('lake-image-img');
    imgNode.attr({
      alt: value.name,
    });
    imgNode.css({
      width: width.toString(10),
      height: height.toString(10),
    });
    root.append(imgNode);
  }, () => {
    // aNode.append(imgNode);
  });
}

// Displays error message.
function renderError(root: Nodes, value: BoxValue): void {
  const buttonGroupNode = query(safeTemplate`
    <div class="lake-button-group">
      <button type="button" class="lake-button-remove" title="Delete"></button>
    </div>
  `);
  const removeButton = buttonGroupNode.find('.lake-button-remove');
  const removeIcon = icons.get('remove');
  if (removeIcon) {
    removeButton.append(removeIcon);
  }
  root.append(buttonGroupNode);
  const errorNode = query(safeTemplate`
    <div class="lake-error">
      <div class="lake-error-icon"></div>
      <div class="lake-error-name">${value.name}</div>
    </div>
  `);
  const imageIcon = icons.get('image');
  if (imageIcon) {
    errorNode.find('.lake-error-icon').append(imageIcon);
  }
  root.append(errorNode);
}

// Displays an image that can be previewed.
function renderDone(root: Nodes, value: BoxValue): void {
  const buttonGroupNode = query(safeTemplate`
    <div class="lake-button-group">
      <button type="button" class="lake-button-view" title="Full screen"></button>
      <button type="button" class="lake-button-remove" title="Delete"></button>
    </div>
  `);
  const viewButton = buttonGroupNode.find('.lake-button-view');
  const maximizeIcon = icons.get('maximize');
  if (maximizeIcon) {
    viewButton.append(maximizeIcon);
  }
  const removeButton = buttonGroupNode.find('.lake-button-remove');
  const removeIcon = icons.get('remove');
  if (removeIcon) {
    removeButton.append(removeIcon);
  }
  root.append(buttonGroupNode);
  loadImage(value.url, (imgNode, width, height) => {
    viewButton.attr({
      href: value.url,
      'data-pswp-width': width.toString(10),
      'data-pswp-height': height.toString(10),
    });
    imgNode.addClass('lake-image-img');
    imgNode.attr({
      alt: value.name,
    });
    imgNode.css({
      width: width.toString(10),
      height: height.toString(10),
    });
    root.append(imgNode);
  }, () => {
    // aNode.append(imgNode);
  });
}

export const imageBox: BoxComponent = {
  type: 'inline',
  name: 'image',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    box.useEffect(() => {
      box.getContainer().on('click', () => {
        editor.selection.range.selectBox(box.node);
      });
      return () => box.getContainer().off('click');
    });
    const value = box.value;
    const root = query('<div class="lake-image" />');
    root.addClass(`lake-image-${value.status}`);
    const container = box.getContainer();
    if (value.status === 'uploading') {
      renderUploading(root, box.value);
    } else if (value.status === 'error') {
      renderError(root, box.value);
    } else {
      renderDone(root, box.value);
    }
    container.empty();
    container.append(root);
    container.find('.lake-button-remove').on('click', event => {
      event.preventDefault();
      event.stopPropagation();
      editor.selection.range.selectBox(box.node);
      editor.selection.removeBox();
      editor.history.save();
    });
  },
  html: box => {
    const value = box.value;
    return safeTemplate`<img src="${value.url}" />`;
  },
};
