import type { Editor } from '..';
import { indentBlock } from '../utils/indent-block';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('indent', {
    execute: (type: 'increase' | 'decrease') => {
      const blocks = editor.selection.range.getBlocks();
      for (const block of blocks) {
        indentBlock(block, type);
      }
      editor.history.save();
    },
  });
};
