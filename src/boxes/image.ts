import 'photoswipe/style.css';
import PhotoSwipeLightbox, { DataSource } from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import debounce from 'debounce';
import { isKeyHotkey } from 'is-hotkey';
import { BoxComponent } from '../types/box';
import { ToolbarItem } from '../types/toolbar';
import { CornerToolbarItem } from '../types/corner-toolbar';
import { icons } from '../icons';
import { query } from '../utils/query';
import { template } from '../utils/template';
import { getBox } from '../utils/get-box';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';
import { CornerToolbar } from '../ui/corner-toolbar';
import { Resizer } from '../ui/resizer';

type ImageInfo = {
  node: Nodes;
  width?: number;
  height?: number;
};

const alignValueMap: {[key: string]: string} = {
  start: 'left',
  end: 'right',
};

function updateBoxMarginBottom(box: Box, captionNode: Nodes): void {
  const height = captionNode.height();
  box.node.find('.lake-box-strip').css('margin-bottom', `${height}px`);
}

function showCaption(box: Box, captionNode: Nodes): void {
  captionNode.show();
  updateBoxMarginBottom(box, captionNode);
}

function hideCaption(box: Box, captionNode: Nodes): void {
  captionNode.hide();
  box.node.find('.lake-box-strip').css('margin-bottom', '');
}

// Creates floating toolbar for the box.
function renderFloatingToolbar(box: Box): void {
  const items: ToolbarItem[] = [
    {
      name: 'caption',
      type: 'button',
      icon: icons.get('caption'),
      tooltip: locale => locale.image.caption(),
      isSelected: () => {
        const boxContainer = box.getContainer();
        const captionNode = boxContainer.find('.lake-image-caption');
        return captionNode.length > 0 && captionNode.computedCSS('display') !== 'none';
      },
      onClick: () => {
        const boxContainer = box.getContainer();
        const captionNode = boxContainer.find('.lake-image-caption');
        const caption = captionNode.text().trim();
        if (caption === '') {
          captionNode.addClass('lake-placeholder');
        }
        showCaption(box, captionNode);
        captionNode.focus();
        box.toolbar?.updateState({
          activeItems: [],
        });
      },
    },
    {
      name: 'align',
      type: 'dropdown',
      downIcon: icons.get('down'),
      icon: icons.get('alignLeft'),
      tooltip: locale => locale.image.align(),
      menuType: 'list',
      menuItems: [
        { value: 'left', text: locale => locale.image.alignLeft() },
        { value: 'center', text: locale => locale.image.alignCenter() },
        { value: 'right', text: locale => locale.image.alignRight() },
      ],
      selectedValues: activeItems => {
        let currentValue;
        for (const item of activeItems) {
          if (item.node.isBlock) {
            currentValue = item.node.computedCSS('text-align');
            break;
          }
        }
        if (!currentValue) {
          return [];
        }
        return [alignValueMap[currentValue] || currentValue];
      },
      onSelect: (editor, value) => {
        editor.command.execute('align', value);
      },
    },
    {
      name: 'resize',
      type: 'dropdown',
      downIcon: icons.get('down'),
      icon: icons.get('resize'),
      tooltip: locale => locale.image.resize(),
      menuType: 'list',
      menuItems: [
        { value: 'page', text: locale => locale.image.pageWidth() },
        { value: '1.00', text: locale => locale.image.originalWidth() },
        { value: '0.75', text: locale => locale.image.imageWidth('75%') },
        { value: '0.50', text: locale => locale.image.imageWidth('50%') },
        { value: '0.25', text: locale => locale.image.imageWidth('25%') },
      ],
      selectedValues: () => {
        const { originalWidth, width } = box.value;
        const editor = box.getEditor();
        const pageWidth = editor.container.innerWidth() - 2;
        let currentValue = '';
        if (width === pageWidth) {
          currentValue = 'page';
        } else {
          currentValue = (width / originalWidth).toFixed(2);
        }
        return [currentValue];
      },
      onSelect: (editor, value) => {
        const { originalWidth, originalHeight } = box.value;
        const boxContainer = box.getContainer();
        const rootNode = boxContainer.find('.lake-image');
        const captionNode = boxContainer.find('.lake-image-caption');
        const rate = originalHeight / originalWidth;
        let newWidth: number;
        if (value === 'page') {
          newWidth = editor.container.innerWidth() - 2;
        } else {
          newWidth = Math.round(originalWidth * Number(value));
        }
        const newHeight = Math.round(rate * newWidth);
        rootNode.css({
          width: `${newWidth}px`,
          height: `${newHeight}px`,
        });
        boxContainer.css('width', `${newWidth}px`);
        updateBoxMarginBottom(box, captionNode);
        box.updateValue({
          width: newWidth,
          height: newHeight,
        });
        editor.history.save();
      },
    },
    {
      name: 'open',
      type: 'button',
      icon: icons.get('open'),
      tooltip: locale => locale.image.open(),
      onClick: () => {
        window.open(box.value.url);
      },
    },
  ];
  box.setToolbar(items);
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

// Previews an image.
function openFullScreen(box: Box): void {
  const editor = box.getEditor();
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
  lightbox.on('openingAnimationEnd', () => {
    box.event.emit('openfullscreen');
  });
  lightbox.on('destroy', () => {
    box.event.emit('closefullscreen');
  });
  lightbox.init();
  lightbox.loadAndOpen(currentIndex);
}

// Creates caption for image.
function renderCaption(box: Box): Nodes {
  const editor = box.getEditor();
  const boxContainer = box.getContainer();
  const defaultCaption = (box.value.caption || '').trim();
  const captionNode = query('<div class="lake-image-caption" />');
  captionNode.text(defaultCaption);
  boxContainer.append(captionNode);
  if (defaultCaption === '') {
    hideCaption(box, captionNode);
  } else {
    showCaption(box, captionNode);
  }
  if (editor.readonly) {
    captionNode.css('-webkit-user-modify', 'read-only');
    return captionNode;
  }
  captionNode.attr('contenteditable', 'true');
  captionNode.attr('placeholder', editor.locale.image.captionPlaceholder());
  const changeHandler = debounce((value: string) => {
    editor.selection.updateByRange();
    if (editor.isComposing) {
      return;
    }
    box.updateValue('caption', value);
    editor.history.save();
  }, 1, {
    immediate: false,
  });
  captionNode.on('input', () => {
    const caption = captionNode.text().trim();
    if (caption === '') {
      captionNode.addClass('lake-placeholder');
    } else {
      captionNode.removeClass('lake-placeholder');
    }
    const height = captionNode.height();
    box.node.find('.lake-box-strip').css('margin-bottom', `${height}px`);
    changeHandler(caption);
  });
  // For supporting "user-modify: read-write-plaintext-only" in Firefox
  captionNode.on('paste', event => {
    event.preventDefault();
    const dataTransfer = (event as ClipboardEvent).clipboardData;
    if (!dataTransfer) {
      return;
    }
    const text = dataTransfer.getData('text/plain').trim();
    document.execCommand('insertText', false, text);
  });
  captionNode.on('keydown', event => {
    if (isKeyHotkey('enter', event as KeyboardEvent)) {
      event.preventDefault();
      editor.selection.selectBox(box);
    }
  });
  captionNode.on('focusout', () => {
    const caption = captionNode.text().trim();
    if (caption === '') {
      hideCaption(box, captionNode);
    }
  });
  return captionNode;
}

// Displays error icon and filename.
async function renderError(box: Box): Promise<void> {
  const editor = box.getEditor();
  const boxContainer = box.getContainer();
  const value = box.value;
  boxContainer.css({
    width: '',
    height: '',
  });
  const errorNode = query(template`
    <div class="lake-error">
      <div class="lake-error-icon"></div>
      <div class="lake-error-name">${value.name || ''}</div>
    </div>
  `);
  const imageBrokenIcon = icons.get('imageBroken');
  if (imageBrokenIcon) {
    errorNode.find('.lake-error-icon').append(imageBrokenIcon);
  }
  const rootNode = query('<div class="lake-image" />');
  rootNode.addClass(`lake-image-${value.status}`);
  new CornerToolbar({
    locale: editor.locale,
    root: rootNode,
    items: [
      {
        name: 'remove',
        icon: icons.get('remove'),
        tooltip: editor.locale.image.remove(),
        onClick: event => {
          event.stopPropagation();
          editor.selection.removeBox(box);
          editor.history.save();
        },
      },
    ],
  }).render();
  rootNode.append(errorNode);
  boxContainer.empty();
  boxContainer.append(rootNode);
}

// Displays an image with uplaoding progress.
async function renderUploading(box: Box): Promise<void> {
  const editor = box.getEditor();
  const boxContainer = box.getContainer();
  const value = box.value;
  const imageInfo = await getImageInfo(value.url);
  if (!boxContainer.get(0).isConnected) {
    return;
  }
  if (!imageInfo.width || !imageInfo.height) {
    await renderError(box);
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
  boxContainer.css({
    width: `${width}px`,
    height: `${height}px`,
  });
  const percent = Math.round(value.percent || 0);
  const progressNode = query(template`
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
  const rootNode = query('<div class="lake-image" />');
  rootNode.addClass(`lake-image-${value.status}`);
  new CornerToolbar({
    locale: editor.locale,
    root: rootNode,
    items: [
      {
        name: 'remove',
        icon: icons.get('remove'),
        tooltip: editor.locale.image.remove(),
        onClick: event => {
          event.stopPropagation();
          editor.selection.removeBox(box);
          editor.history.save();
        },
      },
    ],
  }).render();
  rootNode.append(progressNode);
  rootNode.append(imgNode);
  boxContainer.empty();
  boxContainer.append(rootNode);
}

// Displays an image that can be previewed or removed.
async function renderDone(box: Box): Promise<void> {
  const editor = box.getEditor();
  const boxContainer = box.getContainer();
  const value = box.value;
  const imageInfo = await getImageInfo(value.url);
  if (!boxContainer.get(0).isConnected) {
    return;
  }
  if (!imageInfo.width || !imageInfo.height) {
    await renderError(box);
    return;
  }
  if (!value.originalWidth || !value.originalHeight) {
    box.updateValue({
      originalWidth: imageInfo.width,
      originalHeight: imageInfo.height,
    });
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
  const imgNode = imageInfo.node;
  imgNode.addClass('lake-image-img');
  imgNode.attr({
    draggable: 'false',
    alt: value.name,
  });
  const rootNode = query('<div class="lake-image" />');
  rootNode.addClass(`lake-image-${value.status}`);
  rootNode.css({
    width: `${width}px`,
    height: `${height}px`,
  });
  const cornerToolbarItems: CornerToolbarItem[] = [];
  if (width >= 80 && PhotoSwipeLightbox !== null) {
    cornerToolbarItems.push({
      name: 'view',
      icon: icons.get('maximize'),
      tooltip: editor.locale.image.view(),
      onClick: () => openFullScreen(box),
    });
  }
  if (!editor.readonly) {
    cornerToolbarItems.push({
      name: 'remove',
      icon: icons.get('remove'),
      tooltip: editor.locale.image.remove(),
      onClick: event => {
        event.stopPropagation();
        editor.selection.removeBox(box);
        editor.history.save();
      },
    });
  }
  new CornerToolbar({
    locale: editor.locale,
    root: rootNode,
    items: cornerToolbarItems,
  }).render();
  rootNode.append(imgNode);
  boxContainer.empty();
  boxContainer.append(rootNode);
  boxContainer.css({
    width: `${width}px`,
    height: '',
  });
  const captionNode = renderCaption(box);
  renderFloatingToolbar(box);
  new Resizer({
    root: rootNode,
    target: rootNode,
    onResize: newWidth => {
      boxContainer.css('width', `${newWidth}px`);
      updateBoxMarginBottom(box, captionNode);
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

export default {
  type: 'inline',
  name: 'image',
  render: box => {
    const editor = box.getEditor();
    const value = box.value;
    if (editor.readonly && ['uploading', 'loading', 'error'].indexOf(value.status) >= 0) {
      box.node.hide();
      return;
    }
    const boxContainer = box.getContainer();
    if (value.width && value.height && boxContainer.find('.lake-progress').length === 0) {
      boxContainer.css({
        width: `${value.width}px`,
        height: `${value.height}px`,
      });
      boxContainer.empty();
      const placeholderNode = query('<div class="lake-image-placeholder" />');
      boxContainer.append(placeholderNode);
      const imageIcon = icons.get('image');
      if (imageIcon) {
        placeholderNode.append(imageIcon);
      }
    }
    if (boxContainer.first().length === 0) {
      // The following code is for unit testing because some test cases need to
      // select the content of the box before it is completely loaded.
      // Example:
      // range.setStart(box.getContainer(), 1);
      boxContainer.append('<div />');
    }
    // for test
    if (value.status === 'loading') {
      return;
    }
    let promise: Promise<void>;
    if (value.status === 'uploading') {
      promise = renderUploading(box);
    } else if (value.status === 'error') {
      promise = renderError(box);
    } else {
      promise = renderDone(box);
    }
    promise.then(() => {
      boxContainer.find('.lake-image').on('click', () => {
        editor.selection.selectBox(box);
      });
      box.event.emit('render');
    });
  },
  html: box => {
    const rawValue = box.node.attr('value');
    return template`<img src="${box.value.url}" data-lake-value="${rawValue}" />`;
  },
} as BoxComponent;
