import type Editor from '..';
import { mergeNodes } from '../utils';
import { Range } from '../models/range';
import { setBlocks } from '../operations/set-blocks';

export default (editor: Editor) => {
  editor.keystroke.setKeydown('backspace', event => {
    const range = editor.selection.range;
    if (!range.isCollapsed) {
      event.preventDefault();
      editor.selection.deleteContents();
      editor.history.save();
      editor.select();
      return;
    }
    if (range.isBoxLeft) {
      event.preventDefault();
      const boxNode = range.startNode.closest('lake-box');
      const prevNode = boxNode.prev();
      if (prevNode.isBlock) {
        if (prevNode.isEmpty) {
          prevNode.remove();
          editor.selection.fixList();
          editor.history.save();
          editor.select();
          return;
        }
        range.shrinkAfter(prevNode);
        editor.history.save();
        editor.select();
        return;
      }
      return;
    }
    if (range.isBoxRight) {
      event.preventDefault();
      editor.selection.removeBox();
      editor.history.save();
      editor.select();
      return;
    }
    range.adapt();
    const leftText = range.getLeftText();
    if (leftText === '') {
      event.preventDefault();
      let block = range.getBlocks()[0];
      if (!block) {
        editor.selection.setBlocks('<p />');
        block = range.getBlocks()[0];
      }
      let prevBlock = block.prev();
      if (prevBlock.length === 0) {
        if (block.name !== 'p') {
          editor.selection.setBlocks('<p />');
        }
        editor.history.save();
        editor.select();
        return;
      }
      if (prevBlock.isBox) {
        if (block.isEmpty) {
          block.remove();
        }
        range.selectBoxRight(prevBlock);
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
      const bookmark = editor.selection.insertBookmark();
      mergeNodes(prevBlock, block);
      editor.selection.toBookmark(bookmark);
      editor.selection.fixList();
      editor.history.save();
      editor.select();
    }
  });
};
