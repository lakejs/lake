import type Editor from '..';
import { setBlockIndent } from './indent';

export default (editor: Editor) => {
  editor.keystroke.setKeydown('tab', event => {
    event.preventDefault();
    const blocks = editor.selection.getBlocks();
    for (const block of blocks) {
      if (block.css('text-indent') === '2em') {
        setBlockIndent(block, 'increase');
      } else {
        block.css('text-indent', '2em');
      }
    }
    editor.history.save();
    editor.select();
  });
};
