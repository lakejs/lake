import type Editor from '..';
import { mergeNodes, query } from '../utils';
import { Nodes, Range } from '../models';
import { setBlocks } from '../operations/set-blocks';

// <lake-box><span class="box-strip">|</span><div class="box-body"></div> ...
// <lake-box><span class="box-strip"></span>|<div class="box-body"></div> ...
// <lake-box>|<span class="box-strip"></span><div class="box-body"></div> ...
function isBoxLeft(collapsedRange: Range): boolean {
  const boxNode = collapsedRange.startNode.closest('lake-box');
  if (boxNode.length === 0) {
    return false;
  }
  const boxBody = boxNode.find('.box-body');
  return collapsedRange.compareBeforeNode(boxBody) >= 0;
}

// ... <div class="box-body"></div><span class="box-strip">|</span></lake-box>
// ... <div class="box-body"></div>|<span class="box-strip"></span></lake-box>
// ... <div class="box-body"></div><span class="box-strip"></span>|</lake-box>
function isBoxRight(collapsedRange: Range): boolean {
  const boxNode = collapsedRange.startNode.closest('lake-box');
  if (boxNode.length === 0) {
    return false;
  }
  const boxBody = boxNode.find('.box-body');
  return collapsedRange.compareAfterNode(boxBody) <= 0;
}

function relocateBoxRange(range: Range): void {
  if (range.isCollapsed) {
    return;
  }
  const startBoxNode = range.startNode.closest('lake-box');
  if (startBoxNode.length > 0) {
    const startRange = range.clone();
    startRange.collapseToStart();
    if (isBoxLeft(startRange)) {
      range.setStartBefore(startBoxNode);
    }
    if (isBoxRight(startRange)) {
      range.setStartAfter(startBoxNode);
    }
  }
  const endBoxNode = range.endNode.closest('lake-box');
  if (endBoxNode.length > 0) {
    const endRange = range.clone();
    endRange.collapseToEnd();
    if (isBoxLeft(endRange)) {
      range.setEndBefore(endBoxNode);
    }
    if (isBoxRight(endRange)) {
      range.setEndAfter(endBoxNode);
    }
  }
}

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
    relocateBoxRange(range);
    if (!range.isCollapsed) {
      selection.deleteContents();
      editor.selection.fixList();
      editor.history.save();
      editor.select();
      return;
    }
    if (isBoxLeft(range)) {
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
      relocateBoxRange(range);
      return;
    }
    if (isBoxRight(range)) {
      event.preventDefault();
      removeBox(range);
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
