import type Editor from '..';
import { setBlockIndent } from './indent';

export default (editor: Editor) => {
  editor.keystroke.setKeydown('tab', event => {
    event.preventDefault();
    const blocks = editor.selection.range.getBlocks();
    blocks.forEach(block => {
      if (block.name !== 'p' || block.css('text-indent') === '2em') {
        setBlockIndent(block, 'increase');
        return;
      }
      block.css('text-indent', '2em');
    });
    editor.history.save();
    editor.select();
  });
};
