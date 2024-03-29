import type { Editor } from '..';
import { query } from '../utils';
import { Fragment } from '../models/fragment';
import { Box } from '../models/box';

export default (editor: Editor) => {
  editor.event.on('beforepaste', (nativeFragment: DocumentFragment) => {
    const fragment = new Fragment(nativeFragment);
    fragment.find('hr').each(nativeNode => {
      const node = query(nativeNode);
      const box = new Box('hr');
      node.replaceWith(box.node);
    });
  });
  editor.command.add('hr', () => {
    editor.insertBox('hr');
    editor.history.save();
  });
};
