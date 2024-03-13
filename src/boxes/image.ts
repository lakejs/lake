import type { BoxComponent } from '../types/box';
import { query } from '../utils';
import { safeTemplate } from '../utils/safe-template';

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
    const root = query('<div />');
    const container = box.getContainer();
    container.empty();
    container.append(root);
    root.html(box.value.status);
    const aNode = query('<a href="#" target="_blank" />');
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
      aNode.attr({
        href: box.value.url,
        'data-pswp-width': width.toString(10),
        'data-pswp-height': height.toString(10),
      });
      imgNode.removeAttr('style');
      aNode.append(imgNode);
    });
    imgNode.attr('src', box.value.url);
    query(document.body).append(imgNode);
    root.append(aNode);
  },
  html: box => {
    const value = box.value;
    return safeTemplate`<img src="${value.url}" />`;
  },
};
