import type { Editor } from '..';
import { query } from '../utils';
import { Fragment } from '../models/fragment';
import { Box } from '../models/box';

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
