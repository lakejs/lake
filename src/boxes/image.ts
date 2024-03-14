import 'photoswipe/style.css';
import PhotoSwipeLightbox, { DataSource } from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import { NativeElement, NativeHTMLElement } from '../types/native';
import { BoxComponent } from '../types/box';
import { icons } from '../icons';
import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

type ImageInfo = {
  node: Nodes;
  width?: number;
  height?: number;
};

// Loads an image and get its width and height.
async function getImageInfo(url: string): Promise<ImageInfo> {
  const node = query('<img />');
  node.css({
    position: 'absolute',
    top: '0',
    left: '-8888px',
    'z-index': '-1',
    visibility: 'hidden',
  });
  return new Promise(resolve => {
    node.on('load', () => {
      const imgNativeNode = node.get(0) as HTMLImageElement;
      const width = imgNativeNode.width;
      const height = imgNativeNode.height;
      node.remove();
      node.removeAttr('style');
      resolve({
        node,
        width,
        height,
      });
    });
    node.on('error', () => {
      node.remove();
      resolve({
        node,
      });
    });
    node.attr('src', url);
    query(document.body).append(node);
  });
}

function openFullScreen(box: Box): void {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const dataSource: DataSource = [];
  let currentIndex = 0;
  const allImageBox = editor.container.find('lake-box[name="image"]');
  allImageBox.each((node, index) => {
    const imageBox = new Box(node);
    const imageValue = imageBox.value;
    dataSource.push({
      id: index,
      src: imageValue.url,
      width: imageValue.width,
      height: imageValue.height,
      alt: imageValue.name,
    });
    if (box.node.id === imageBox.node.id) {
      currentIndex = index;
    }
  });
  const lightbox = new PhotoSwipeLightbox({
    dataSource,
    pswpModule: PhotoSwipe,
  });
  lightbox.addFilter('thumbEl', (thumbnail, itemData) => {
    const imgNativeNode = allImageBox.eq(itemData.id).find('.lake-image-img').get(0) as NativeHTMLElement;
    if (imgNativeNode) {
      return imgNativeNode;
    }
    return thumbnail as NativeHTMLElement;
  });
  lightbox.addFilter('placeholderSrc', (placeholderSrc, slide) => {
    const imgNode = allImageBox.eq(slide.data.id).find('.lake-image-img');
    if (imgNode) {
      return imgNode.attr('src');
    }
    return placeholderSrc;
  });
  lightbox.on('close', () => {
    lightbox.destroy();
  });
  lightbox.init();
  lightbox.loadAndOpen(currentIndex);
}

// Displays error message.
function renderError(root: Nodes, box: Box): void {
  const value = box.value;
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

// Displays an image with uplaoding progress.
async function renderUploading(root: Nodes, box: Box): Promise<void> {
  const value = box.value;
  const imageInfo = await getImageInfo(value.url);
  if (!imageInfo.width || !imageInfo.height) {
    renderError(root, box);
    return;
  }
  value.width = imageInfo.width;
  value.height = imageInfo.height;
  box.value = value;
  const progressNode = query('<div class="lake-progress"><div class="lake-percent">0 %</div></div>');
  const circleNotchIcon = icons.get('circleNotch');
  if (circleNotchIcon) {
    progressNode.prepend(circleNotchIcon);
  }
  root.append(progressNode);
  const imgNode = imageInfo.node;
  imageInfo.node.addClass('lake-image-img');
  imgNode.attr({
    alt: value.name,
  });
  imgNode.css({
    width: `${imageInfo.width}px`,
    height: `${imageInfo.height}px`,
  });
  root.append(imgNode);
}

// Displays an image that can be previewed.
async function renderDone(root: Nodes, box: Box): Promise<void> {
  const value = box.value;
  const imageInfo = await getImageInfo(value.url);
  if (!imageInfo.width || !imageInfo.height) {
    renderError(root, box);
    return;
  }
  value.width = imageInfo.width;
  value.height = imageInfo.height;
  box.value = value;
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
  const imgNode = imageInfo.node;
  imgNode.addClass('lake-image-img');
  imgNode.attr({
    alt: value.name,
  });
  imgNode.css({
    width: `${imageInfo.width}px`,
    height: `${imageInfo.height}px`,
  });
  root.append(imgNode);
  viewButton.on('click', () => openFullScreen(box));
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
      renderUploading(root, box);
    } else if (value.status === 'error') {
      renderError(root, box);
    } else {
      renderDone(root, box);
    }
    container.empty();
    container.append(root);
    container.on('click', event => {
      const targetNode = new Nodes(event.target as NativeElement);
      if (targetNode.closest('.lake-button-remove').length === 0) {
        return;
      }
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
