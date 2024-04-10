import type { Editor } from '..';
import { mergeNodes } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { setBlocks } from '../operations/set-blocks';

function mergeWithNextBlock(editor: Editor, block: Nodes): void {
  const range = editor.selection.range;
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
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('delete', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    editor.rectifyContent();
    if (range.isBoxRight) {
      const boxNode = range.startNode.closest('lake-box');
      const nextNode = boxNode.next();
      if (nextNode.length === 0) {
        const block = boxNode.closestBlock();
        if (block.length > 0 && !block.isContainer) {
          event.preventDefault();
          mergeWithNextBlock(editor, block);
          editor.history.save();
        }
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
        event.preventDefault();
        range.shrinkBefore(nextNode);
        return;
      }
      range.adaptBox();
    }
    if (range.isBox) {
      event.preventDefault();
      editor.removeBox();
      editor.history.save();
      return;
    }
    if (!range.isCollapsed) {
      event.preventDefault();
      editor.selection.deleteContents();
      if (editor.container.html().trim() === '') {
        editor.setValue('<p><br /><focus /></p>');
      }
      editor.history.save();
      return;
    }
    range.adapt();
    const nextNode = range.getNextNode();
    if (nextNode.isBox) {
      event.preventDefault();
      range.selectBox(nextNode);
      editor.removeBox();
      editor.history.save();
      return;
    }
    const rightText = range.getRightText();
    if (rightText === '') {
      event.preventDefault();
      let block = range.getBlocks()[0];
      if (!block) {
        editor.selection.setBlocks('<p />');
        block = range.getBlocks()[0];
      }
      mergeWithNextBlock(editor, block);
      editor.history.save();
      return;
    }
    if (nextNode.name === 'br') {
      event.preventDefault();
      range.setStartBefore(nextNode);
      range.collapseToStart();
      nextNode.remove();
      editor.history.save();
    }
  });
};
