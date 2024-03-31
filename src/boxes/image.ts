import 'photoswipe/style.css';
import PhotoSwipeLightbox, { DataSource } from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import { NativeHTMLElement } from '../types/native';
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

function bindResizerEvents(pointerNode: Nodes, box: Box): void {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const boxContainer = box.getContainer();
  const resizerNode = pointerNode.closest('.lake-resizer');
  const infoNode = resizerNode.find('.lake-resizer-info');
  const isPlus = pointerNode.attr('class').indexOf('-right') >= 0;
  const initialWidth = boxContainer.width();
  const initialHeight = boxContainer.height();
  const rate = initialHeight / initialWidth;
  let clientX = 0;
  let width = 0;
  // resizing box
  const pointermoveListener = (event: Event) => {
    const pointerEvent = event as PointerEvent;
    const diffX = pointerEvent.clientX - clientX;
    const newWidth = Math.round(isPlus ? width + diffX : width - diffX);
    const newHeight = Math.round(rate * newWidth);
    boxContainer.css({
      width: `${newWidth}px`,
      height: `${newHeight}px`,
    });
    infoNode.text(`${newWidth} x ${newHeight}`);
  };
  // start resizing
  const pointerdownListener = (event: Event) => {
    const pointerEvent = event as PointerEvent;
    const pointerNativeNode = pointerNode.get(0) as Element;
    // The capture will be implicitly released after a pointerup or pointercancel event.
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture
    pointerNativeNode.setPointerCapture(pointerEvent.pointerId);
    clientX = pointerEvent.clientX;
    width = boxContainer.width();
    infoNode.show();
    pointerNode.on('pointermove', pointermoveListener);
  };
  // stop resizing
  const pointerupListner = () => {
    pointerNode.off('pointermove');
    infoNode.hide();
    width = box.getContainer().width();
    const height = Math.round(rate * width);
    box.updateValue({
      width,
      height,
    });
    editor.history.save();
  };
  // cancel resizing
  const pointercancelListner = () => {
    pointerNode.off('pointermove');
    infoNode.hide();
  };
  pointerNode.on('pointerdown', pointerdownListener);
  pointerNode.on('pointerup', pointerupListner);
  pointerNode.on('pointercancel', pointercancelListner);
}

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

// Opens full screen view.
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
    if (imageValue.status !== 'done') {
      return;
    }
    dataSource.push({
      id: index,
      src: imageValue.originalUrl || imageValue.url,
      width: imageValue.originalWidth || imageValue.width,
      height: imageValue.originalHeight || imageValue.height,
      alt: imageValue.name,
    });
    if (box.node.id === imageBox.node.id) {
      currentIndex = index;
    }
  });
  const lightbox = new PhotoSwipeLightbox({
    pswpModule: PhotoSwipe,
    dataSource,
    mainClass: 'lake-pswp',
    zoom: false,
    arrowPrevSVG: icons.get('left'),
    arrowNextSVG: icons.get('right'),
    closeSVG: icons.get('close'),
    arrowPrevTitle: 'Previous',
    arrowNextTitle: 'Next',
    closeTitle: 'Close (Esc)',
    errorMsg: 'The image cannot be loaded',
  });
  lightbox.on('uiRegister', () => {
    const pswp: any = lightbox.pswp;
    pswp.ui.registerElement({
      name: 'zoom-out-button',
      order: 8,
      isButton: true,
      title: 'Zoom out',
      html: icons.get('zoomOut'),
      onClick: () => {
        const currSlide = pswp.currSlide;
        const step = (currSlide.zoomLevels.max - currSlide.zoomLevels.min) / 5;
        const destZoomLevel = currSlide.currZoomLevel - step;
        currSlide.zoomTo(destZoomLevel, undefined, 333);
      },
    });
    pswp.ui.registerElement({
      name: 'zoom-in-button',
      order: 9,
      isButton: true,
      title: 'Zoom in',
      html: icons.get('zoomIn'),
      onClick: () => {
        const currSlide = pswp.currSlide;
        const step = (currSlide.zoomLevels.max - currSlide.zoomLevels.min) / 5;
        const destZoomLevel = currSlide.currZoomLevel + step;
        currSlide.zoomTo(destZoomLevel, undefined, 333);
      },
    });
  });
  lightbox.addFilter('thumbEl', (thumbnail, itemData) => {
    const imgNode = allImageBox.eq(itemData.id).find('.lake-image-img');
    if (imgNode.length > 0) {
      return imgNode.get(0) as NativeHTMLElement;
    }
    return thumbnail as NativeHTMLElement;
  });
  lightbox.addFilter('placeholderSrc', (placeholderSrc, slide) => {
    const imgNode = allImageBox.eq(slide.data.id).find('.lake-image-img');
    if (imgNode.length > 0) {
      return imgNode.attr('src');
    }
    return placeholderSrc;
  });
  lightbox.on('openingAnimationEnd', () => {
    box.event.emit('openfullscreen');
  });
  lightbox.init();
  lightbox.loadAndOpen(currentIndex);
}

// Removes current box.
function removeImageBox(box: Box): void {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const xhr = box.getData('xhr');
  if (xhr) {
    xhr.abort();
  }
  editor.selection.range.selectBox(box.node);
  editor.removeBox();
  editor.history.save();
}

// Displays error icon and filename.
async function renderError(root: Nodes, box: Box): Promise<void> {
  const value = box.value;
  box.getContainer().css({
    width: '',
    height: '',
  });
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
  const errorNode = query(safeTemplate`
    <div class="lake-error">
      <div class="lake-error-icon"></div>
      <div class="lake-error-name">${value.name || ''}</div>
    </div>
  `);
  const imageIcon = icons.get('image');
  if (imageIcon) {
    errorNode.find('.lake-error-icon').append(imageIcon);
  }
  root.append(buttonGroupNode);
  root.append(errorNode);
}

// Displays an image with uplaoding progress.
async function renderUploading(root: Nodes, box: Box): Promise<void> {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const value = box.value;
  const imageInfo = await getImageInfo(value.url);
  if (!imageInfo.width || !imageInfo.height) {
    await renderError(root, box);
    return;
  }
  const maxWidth = editor.innerWidth() - 2;
  const width = imageInfo.width < maxWidth ? imageInfo.width : maxWidth;
  const height = Math.round(width * imageInfo.height / imageInfo.width);
  box.updateValue({
    width,
    height,
    originalWidth: imageInfo.width,
    originalHeight: imageInfo.height,
  });
  box.getContainer().css({
    width: `${width}px`,
    height: `${height}px`,
  });
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
  const percent = Math.round(value.percent || 0);
  const progressNode = query(safeTemplate`
    <div class="lake-progress">
      <div class="lake-percent">${percent} %</div>
    </div>
  `);
  if (width < 80) {
    progressNode.find('.lake-percent').hide();
  }
  const circleNotchIcon = icons.get('circleNotch');
  if (circleNotchIcon) {
    progressNode.prepend(circleNotchIcon);
  }
  const imgNode = imageInfo.node;
  imageInfo.node.addClass('lake-image-img');
  imgNode.attr({
    draggable: 'false',
    alt: value.name,
  });
  root.append(buttonGroupNode);
  root.append(progressNode);
  root.append(imgNode);
}

// Displays an image that can be previewed or removed.
async function renderDone(root: Nodes, box: Box): Promise<void> {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const value = box.value;
  const imageInfo = await getImageInfo(value.url);
  if (!imageInfo.width || !imageInfo.height) {
    await renderError(root, box);
    return;
  }
  let width = value.width;
  let height = value.height;
  if (!width || !height) {
    const maxWidth = editor.innerWidth() - 2;
    width = Math.round(imageInfo.width < maxWidth ? imageInfo.width : maxWidth);
    height = Math.round(width * imageInfo.height / imageInfo.width);
    box.updateValue({
      width,
      height,
    });
  }
  box.getContainer().css({
    width: `${width}px`,
    height: `${height}px`,
  });
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
  if (width < 80) {
    viewButton.hide();
  }
  const removeButton = buttonGroupNode.find('.lake-button-remove');
  const removeIcon = icons.get('remove');
  if (removeIcon) {
    removeButton.append(removeIcon);
  }
  const resizerNode = query(safeTemplate`
    <div class="lake-resizer">
      <div class="lake-resizer-top-left"></div>
      <div class="lake-resizer-top-right"></div>
      <div class="lake-resizer-bottom-left"></div>
      <div class="lake-resizer-bottom-right"></div>
      <div class="lake-resizer-info">${width} x ${height}</div>
    </div>
  `);
  const imgNode = imageInfo.node;
  imgNode.addClass('lake-image-img');
  imgNode.attr({
    draggable: 'false',
    alt: value.name,
  });
  bindResizerEvents(resizerNode.find('.lake-resizer-top-left'), box);
  bindResizerEvents(resizerNode.find('.lake-resizer-top-right'), box);
  bindResizerEvents(resizerNode.find('.lake-resizer-bottom-left'), box);
  bindResizerEvents(resizerNode.find('.lake-resizer-bottom-right'), box);
  root.append(buttonGroupNode);
  root.append(resizerNode);
  root.append(imgNode);
}

export const imageBox: BoxComponent = {
  type: 'inline',
  name: 'image',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const value = box.value;
    const container = box.getContainer();
    if (value.width && value.height && container.find('.lake-progress').length === 0) {
      container.css({
        width: `${value.width}px`,
        height: `${value.height}px`,
      });
      container.empty();
      const placeholderNode = query('<div class="lake-image-placeholder" />');
      container.append(placeholderNode);
      const imageIcon = icons.get('image');
      if (imageIcon) {
        placeholderNode.append(imageIcon);
      }
    }
    if (container.first().length === 0) {
      // The code below is for unit testing because some test cases need to
      // select the content of the box before it is completely loaded.
      // Example:
      // range.setStart(box.getContainer(), 1);
      container.append('<div />');
    }
    // for test
    if (value.status === 'loading') {
      return;
    }
    const root = query('<div class="lake-image" />');
    root.addClass(`lake-image-${value.status}`);
    let promise: Promise<void>;
    if (value.status === 'uploading') {
      promise = renderUploading(root, box);
    } else if (value.status === 'error') {
      promise = renderError(root, box);
    } else {
      promise = renderDone(root, box);
    }
    promise.then(() => {
      container.empty();
      container.append(root);
      root.find('.lake-button-view').on('click', () => openFullScreen(box));
      root.find('.lake-button-remove').on('click', event => {
        event.stopPropagation();
        removeImageBox(box);
      });
      box.event.emit('render');
    });
    root.on('click', () => {
      editor.selection.range.selectBox(box.node);
    });
  },
  html: box => {
    const value = box.node.attr('value');
    return safeTemplate`<img src="${box.value.url}" data-lake-value="${value}" />`;
  },
};
