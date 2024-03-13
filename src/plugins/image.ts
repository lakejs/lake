import type { Editor } from '..';
import { BoxValue } from '../types/box';
import { query } from '../utils';
import { Box } from '../models/box';
import { Fragment } from '../models/fragment';

export default (editor: Editor) => {
  editor.event.on('beforepaste', (nativeFragment: DocumentFragment) => {
    const fragment = new Fragment(nativeFragment);
    fragment.find('img').each(nativeNode => {
      const node = query(nativeNode);
      const box = new Box('image');
      box.value = {
        url: node.attr('src'),
        status: 'done',
      };
      node.replaceWith(box.node);
    });
  });
  editor.command.add('image', (value: BoxValue) => {
    editor.selection.insertBox('image', value);
    editor.history.save();
  });
};
