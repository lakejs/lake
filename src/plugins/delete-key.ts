import type Editor from '..';
import { mergeNodes } from '../utils';
import { Range } from '../models/range';
import { setBlocks } from '../operations/set-blocks';

export default (editor: Editor) => {
  editor.keystroke.setKeydown('delete', event => {
    const range = editor.selection.range;
    if (range.isBox) {
      if (range.isBoxRight) {
        const boxNode = range.startNode.closest('lake-box');
        const nextNode = boxNode.next();
        if (nextNode.length === 0) {
          return;
        }
        if (nextNode.isBlock) {
          if (nextNode.isEmpty) {
            event.preventDefault();
            nextNode.remove();
            editor.selection.fixList();
            editor.history.save();
            return;
          }
          range.shrinkBefore(nextNode);
          return;
        }
        range.adaptBox();
        return;
      }
      event.preventDefault();
      editor.selection.removeBox();
      editor.history.save();
      return;
    }
    if (!range.isCollapsed) {
      event.preventDefault();
      editor.selection.deleteContents();
      editor.history.save();
      return;
    }
    range.adapt();
    const rightText = range.getRightText();
    if (rightText === '') {
      event.preventDefault();
      let block = range.getBlocks()[0];
      if (!block) {
        editor.selection.setBlocks('<p />');
        block = range.getBlocks()[0];
      }
      let nextBlock = block.next();
      if (nextBlock.length === 0) {
        editor.history.save();
        return;
      }
      if (nextBlock.isBox) {
        if (block.isEmpty) {
          block.remove();
        }
        range.selectBoxLeft(nextBlock);
        editor.history.save();
        return;
      }
      if (!nextBlock.isBlock) {
        const nextRange = new Range();
        nextRange.selectNodeContents(nextBlock);
        setBlocks(nextRange, '<p />');
        nextBlock = nextBlock.closestBlock();
      }
      const bookmark = editor.selection.insertBookmark();
      mergeNodes(block, nextBlock);
      editor.selection.toBookmark(bookmark);
      editor.selection.fixList();
      editor.history.save();
    }
  });
};
