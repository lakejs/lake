import type { Editor, BoxComponent } from '..';
import { query } from '../utils';
import { Fragment } from '../models/fragment';
import { Box } from '../models/box';

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
    return `<img src="${box.value.url}" />`;
  },
  html: box => `<img src="${box.value.url}" />`,
};

export default (editor: Editor) => {
  editor.event.on('beforepaste', (nativeFragment: DocumentFragment) => {
    const fragment = new Fragment(nativeFragment);
    fragment.find('img').each(nativeNode => {
      const node = query(nativeNode);
      const box = new Box('image');
      box.value = {
        url: node.attr('src'),
      };
      node.replaceWith(box.node);
    });
  });
  editor.command.add('image', url => {
    editor.selection.insertBox('image', {
      url,
    });
    editor.history.save();
  });
};
