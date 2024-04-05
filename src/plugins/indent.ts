import type { Editor } from '..';
import { setBlockIndent } from '../utils';

export default (editor: Editor) => {
  editor.command.add('indent', {
    execute: (type: 'increase' | 'decrease') => {
      const blocks = editor.selection.range.getBlocks();
      for (const block of blocks) {
        setBlockIndent(block, type);
      }
      editor.history.save();
    },
  });
};
