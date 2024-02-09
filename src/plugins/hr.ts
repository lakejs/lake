import type { Editor, BoxComponent } from '..';
import { query } from '../utils';
import { Fragment } from '../models/fragment';
import { Box } from '../models/box';

export const hrBox: BoxComponent = {
  type: 'block',
  name: 'hr',
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
    return '<hr />';
  },
  html: () => '<hr />',
};

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
    editor.selection.insertBox('hr');
    editor.history.save();
  });
};
