import type Editor from '..';
import { mergeNodes } from '../utils';
import { Range } from '../models';
import { adjustStartAttributes } from './list';
import { setBlocks } from '../operations/set-blocks';

export default (editor: Editor) => {
  editor.keystroke.setKeydown('backspace', event => {
    const selection = editor.selection;
    const range = selection.range;
    if (!range.isCollapsed) {
      selection.deleteContents();
      adjustStartAttributes(editor);
      editor.history.save();
      editor.select();
      return;
    }
    const leftText = selection.getLeftText();
    if (leftText === '') {
      event.preventDefault();
      let block = selection.getBlocks()[0];
      if (!block) {
        editor.selection.setBlocks('<p />');
        block = selection.getBlocks()[0];
      }
      let prevBlock = block.prev();
      if (prevBlock.length === 0) {
        if (block.name !== 'p') {
          editor.selection.setBlocks('<p />');
        }
        adjustStartAttributes(editor);
        editor.history.save();
        editor.select();
        return;
      }
      if (!prevBlock.isBlock) {
        const prevRange = new Range();
        prevRange.selectNodeContents(prevBlock);
        setBlocks(prevRange, '<p />');
        prevBlock = prevBlock.closestBlock();
      }
      const bookmark = selection.insertBookmark();
      mergeNodes(prevBlock, block);
      selection.toBookmark(bookmark);
      adjustStartAttributes(editor);
      editor.history.save();
      editor.select();
    }
  });
};
