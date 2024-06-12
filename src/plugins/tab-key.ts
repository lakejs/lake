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
    event.preventDefault();
    const blocks = editor.selection.range.getBlocks();
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
