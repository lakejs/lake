import type { Editor } from '@/editor';
import { indentBlock } from '@/utils/indent-block';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.keystroke.setKeydown('tab', event => {
    if (editor.config.indentWithTab === false) {
      return;
    }
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    event.preventDefault();
    const blocks = range.getBlocks();
    for (const block of blocks) {
      if (block.name !== 'p' || block.css('text-indent') === '2em') {
        indentBlock(block, 'increase');
      } else {
        block.css('text-indent', '2em');
      }
    }
    editor.history.save();
  });
};
