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
  const circleNotch = icons.get('circleNotch');
  if (circleNotch) {
    progressNode.prepend(circleNotch);
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
  loadImage(value.url, (imgNode, width, height) => {
    const aNode = query('<a target="_blank" />');
    aNode.attr({
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
    aNode.append(imgNode);
    root.append(aNode);
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
  },
  html: box => {
    const value = box.value;
    return safeTemplate`<img src="${value.url}" />`;
  },
};
