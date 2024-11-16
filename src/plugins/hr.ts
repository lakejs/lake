import type { Editor } from '..';
import { query } from '../utils/query';
import { getBox } from '../utils/get-box';
import { Fragment } from '../models/fragment';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.event.on('beforepaste', (nativeFragment: DocumentFragment) => {
    const fragment = new Fragment(nativeFragment);
    fragment.find('hr').each(nativeNode => {
      const node = query(nativeNode);
      const box = getBox('hr');
      node.replaceWith(box.node);
    });
  });
  editor.command.add('hr', {
    execute: () => {
      editor.selection.insertBox('hr');
      editor.history.save();
    },
  });
};
