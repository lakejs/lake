import 'photoswipe/style.css';
import PhotoSwipeLightbox, { DataSource } from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import { BoxComponent } from '../types/box';
import { icons } from '../icons';
import { query } from '../utils/query';
import { getBox } from '../utils/get-box';
import { safeTemplate } from '../utils/safe-template';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { Box } from '../models/box';
import { BoxResizer } from '../ui/box-resizer';

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
    const imageBox = getBox(node);
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
    returnFocus: false,
    arrowPrevSVG: icons.get('left'),
    arrowNextSVG: icons.get('right'),
    closeSVG: icons.get('close'),
    arrowPrevTitle: editor.locale.image.previous(),
    arrowNextTitle: editor.locale.image.next(),
    closeTitle: editor.locale.image.close(),
    errorMsg: editor.locale.image.loadingError(),
  });
  lightbox.on('uiRegister', () => {
    const pswp: any = lightbox.pswp;
    pswp.ui.registerElement({
      name: 'zoom-out-button',
      order: 8,
      isButton: true,
      title: editor.locale.image.zoomOut(),
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
      title: editor.locale.image.zoomIn(),
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
      return imgNode.get(0) as HTMLElement;
    }
    return thumbnail as HTMLElement;
  });
  lightbox.addFilter('placeholderSrc', (placeholderSrc, slide) => {
    const imgNode = allImageBox.eq(slide.data.id).find('.lake-image-img');
    if (imgNode.length > 0) {
      return imgNode.attr('src');
    }
    return placeholderSrc;
  });
  let savedRange: Range;
  lightbox.on('openingAnimationEnd', () => {
    savedRange = editor.selection.range;
    box.event.emit('openfullscreen');
  });
  lightbox.on('destroy', () => {
    window.setTimeout(() => {
      if (savedRange) {
        // fix(image): lose focus when zooming in the iOS
        editor.selection.range = savedRange;
        editor.selection.sync();
      }
      box.event.emit('closefullscreen');
    }, 0);
  });
  lightbox.init();
  lightbox.loadAndOpen(currentIndex);
}

// Displays error icon and filename.
async function renderError(imageNode: Nodes, box: Box): Promise<void> {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const value = box.value;
  box.getContainer().css({
    width: '',
    height: '',
  });
  const buttonGroupNode = query(safeTemplate`
    <div class="lake-button-group">
      <button type="button" tabindex="-1" class="lake-button-remove" title="${editor.locale.image.remove()}"></button>
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
  imageNode.append(buttonGroupNode);
  imageNode.append(errorNode);
}

// Displays an image with uplaoding progress.
async function renderUploading(imageNode: Nodes, box: Box): Promise<void> {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const value = box.value;
  const imageInfo = await getImageInfo(value.url);
  if (!imageInfo.width || !imageInfo.height) {
    await renderError(imageNode, box);
    return;
  }
  const maxWidth = editor.container.innerWidth() - 2;
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
      <button type="button" tabindex="-1" class="lake-button-remove" title="${editor.locale.image.remove()}"></button>
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
  imageNode.append(buttonGroupNode);
  imageNode.append(progressNode);
  imageNode.append(imgNode);
}

// Displays an image that can be previewed or removed.
async function renderDone(imageNode: Nodes, box: Box): Promise<void> {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const boxContainer = box.getContainer();
  const value = box.value;
  const imageInfo = await getImageInfo(value.url);
  if (!boxContainer.get(0).isConnected) {
    return;
  }
  if (!imageInfo.width || !imageInfo.height) {
    await renderError(imageNode, box);
    return;
  }
  let width = value.width;
  let height = value.height;
  if (!width || !height) {
    const maxWidth = editor.container.innerWidth() - 2;
    width = Math.round(imageInfo.width < maxWidth ? imageInfo.width : maxWidth);
    height = Math.round(width * imageInfo.height / imageInfo.width);
    box.updateValue({
      width,
      height,
    });
  }
  boxContainer.css({
    width: `${width}px`,
    height: `${height}px`,
  });
  const buttonGroupNode = query(safeTemplate`
    <div class="lake-button-group">
      <button type="button" tabindex="-1" class="lake-button-view" title="${editor.locale.image.view()}"></button>
      <button type="button" tabindex="-1" class="lake-button-remove" title="${editor.locale.image.remove()}"></button>
    </div>
  `);
  const viewButton = buttonGroupNode.find('.lake-button-view');
  const maximizeIcon = icons.get('maximize');
  if (maximizeIcon) {
    viewButton.append(maximizeIcon);
  }
  if (width < 80 || PhotoSwipeLightbox === null) {
    viewButton.hide();
  }
  const removeButton = buttonGroupNode.find('.lake-button-remove');
  const removeIcon = icons.get('remove');
  if (removeIcon) {
    removeButton.append(removeIcon);
  }
  const imgNode = imageInfo.node;
  imgNode.addClass('lake-image-img');
  imgNode.attr({
    draggable: 'false',
    alt: value.name,
  });
  imageNode.append(buttonGroupNode);
  new BoxResizer({
    root: imageNode,
    box,
    width,
    height,
    onStop: (newWidth, newHeight) => {
      box.updateValue({
        width: newWidth,
        height: newHeight,
      });
      editor.history.save();
    },
  }).render();
  imageNode.append(imgNode);
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
    if (editor.readonly && ['uploading', 'loading', 'error'].indexOf(value.status) >= 0) {
      box.node.hide();
      return;
    }
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
      // The following code is for unit testing because some test cases need to
      // select the content of the box before it is completely loaded.
      // Example:
      // range.setStart(box.getContainer(), 1);
      container.append('<div />');
    }
    // for test
    if (value.status === 'loading') {
      return;
    }
    const imageNode = query('<div class="lake-image" />');
    imageNode.addClass(`lake-image-${value.status}`);
    let promise: Promise<void>;
    if (value.status === 'uploading') {
      promise = renderUploading(imageNode, box);
    } else if (value.status === 'error') {
      promise = renderError(imageNode, box);
    } else {
      promise = renderDone(imageNode, box);
    }
    promise.then(() => {
      container.empty();
      container.append(imageNode);
      imageNode.find('.lake-button-view').on('click', () => openFullScreen(box));
      if (editor.readonly) {
        imageNode.find('.lake-button-remove').hide();
      } else {
        imageNode.find('.lake-button-remove').on('click', event => {
          event.stopPropagation();
          const xhr = box.getData('xhr');
          if (xhr) {
            xhr.abort();
          }
          editor.removeBox(box);
          editor.history.save();
          editor.selection.sync();
        });
      }
      box.event.emit('render');
    });
    imageNode.on('click', () => {
      editor.selectBox(box);
    });
  },
  html: box => {
    const value = box.node.attr('value');
    return safeTemplate`<img src="${box.value.url}" data-lake-value="${value}" />`;
  },
};
