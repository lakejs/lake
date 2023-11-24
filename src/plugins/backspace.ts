import type Editor from '..';
import { mergeNodes, query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { setBlocks } from '../operations/set-blocks';

function removeBox(range: Range, boxNode?: Nodes): void {
  boxNode = boxNode ?? range.startNode.closest('lake-box');
  const type = boxNode.attr('type');
  if (type === 'block') {
    const paragraph = query('<p><br /></p>');
    boxNode.before(paragraph);
    range.selectAfterNodeContents(paragraph);
    boxNode.remove();
    return;
  }
  range.setStartBefore(boxNode);
  range.collapseToStart();
  boxNode.remove();
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('backspace', event => {
    const selection = editor.selection;
    const range = selection.range;
    range.adapt();
    if (!range.isCollapsed) {
      selection.deleteContents();
      editor.selection.fixList();
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
        range.selectAfterNodeContents(prevNode);
        editor.history.save();
        editor.select();
        return;
      }
      range.adapt();
      return;
    }
    if (range.isBoxRight) {
      event.preventDefault();
      removeBox(range);
      editor.history.save();
      editor.select();
      return;
    }
    const leftText = range.getLeftText();
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
        editor.history.save();
        editor.select();
        return;
      }
      if (prevBlock.isBox) {
        removeBox(range, prevBlock);
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
      editor.selection.fixList();
      editor.history.save();
      editor.select();
    }
  });
};
