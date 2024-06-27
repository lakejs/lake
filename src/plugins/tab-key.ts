import type { Editor } from '..';
import { setBlockIndent } from '../utils';

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
        setBlockIndent(block, 'increase');
      } else {
        block.css('text-indent', '2em');
      }
    }
    editor.history.save();
  });
};
