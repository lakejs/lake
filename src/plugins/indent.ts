import type { Editor } from '..';
import { setBlockIndent } from '../utils/set-block-indent';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
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
