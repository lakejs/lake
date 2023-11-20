import type Editor from '..';
import { mergeNodes, query } from '../utils';
import { Nodes, Range } from '../models';
import { setBlocks } from '../operations/set-blocks';

// <figure><span class="figure-left">|</span><div class="figure-body"></div> ...
// <figure><span class="figure-left"></span>|<div class="figure-body"></div> ...
// <figure>|<span class="figure-left"></span><div class="figure-body"></div> ...
function isFigureLeft(collapsedRange: Range): boolean {
  if (!collapsedRange.startNode.inFigure) {
    return false;
  }
  const figureNode = collapsedRange.startNode.closest('figure');
  const figureBody = figureNode.find('.figure-body');
  return collapsedRange.compareBeforeNode(figureBody) >= 0;
}

// ... <div class="figure-body"></div><span class="figure-right">|</span></figure>
// ... <div class="figure-body"></div>|<span class="figure-right"></span></figure>
// ... <div class="figure-body"></div><span class="figure-right"></span>|</figure>
function isFigureRight(collapsedRange: Range): boolean {
  if (!collapsedRange.startNode.inFigure) {
    return false;
  }
  const figureNode = collapsedRange.startNode.closest('figure');
  const figureBody = figureNode.find('.figure-body');
  return collapsedRange.compareAfterNode(figureBody) <= 0;
}

function relocateFigureRange(range: Range): void {
  if (range.isCollapsed) {
    return;
  }
  if (range.startNode.inFigure) {
    const startRange = range.clone();
    startRange.collapseToStart();
    const figureNode = range.startNode.closest('figure');
    if (isFigureLeft(startRange)) {
      range.setStartBefore(figureNode);
    }
    if (isFigureRight(startRange)) {
      range.setStartAfter(figureNode);
    }
  }
  if (range.endNode.inFigure) {
    const endRange = range.clone();
    endRange.collapseToEnd();
    const figureNode = range.endNode.closest('figure');
    if (isFigureLeft(endRange)) {
      range.setEndBefore(figureNode);
    }
    if (isFigureRight(endRange)) {
      range.setEndAfter(figureNode);
    }
  }
}

function removeFigure(range: Range, figureNode?: Nodes): void {
  figureNode = figureNode ?? range.startNode.closest('figure');
  const type = figureNode.attr('type');
  if (type === 'block') {
    const paragraph = query('<p><br /></p>');
    figureNode.before(paragraph);
    range.selectAfterNodeContents(paragraph);
    figureNode.remove();
    return;
  }
  range.setStartBefore(figureNode);
  range.collapseToStart();
  figureNode.remove();
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('backspace', event => {
    const selection = editor.selection;
    const range = selection.range;
    relocateFigureRange(range);
    if (!range.isCollapsed) {
      selection.deleteContents();
      editor.selection.fixList();
      editor.history.save();
      editor.select();
      return;
    }
    if (isFigureLeft(range)) {
      event.preventDefault();
      const figureNode = range.startNode.closest('figure');
      const prevNode = figureNode.prev();
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
      relocateFigureRange(range);
      return;
    }
    if (isFigureRight(range)) {
      event.preventDefault();
      removeFigure(range);
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
      if (prevBlock.inFigure) {
        removeFigure(range, prevBlock);
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
