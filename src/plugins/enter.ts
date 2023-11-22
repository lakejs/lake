import type Editor from '..';
import { Range } from '../models';
import { query } from '../utils';

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

function setParagraph(editor: Editor) {
  editor.selection.setBlocks('<p />');
  editor.history.save();
  editor.select();
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('enter', event => {
    event.preventDefault();
    const selection = editor.selection;
    const range = selection.range;
    relocateBoxRange(range);
    if (isBoxLeft(range)) {
      const boxNode = range.startNode.closest('lake-box');
      const prevBlock = query('<p><br /></p>');
      boxNode.before(prevBlock);
      editor.history.save();
      editor.select();
      return;
    }
    if (isBoxRight(range)) {
      const boxNode = range.startNode.closest('lake-box');
      const nextBlock = query('<p><br /></p>');
      boxNode.after(nextBlock);
      range.selectAfterNodeContents(nextBlock);
      editor.history.save();
      editor.select();
      return;
    }
    let block = selection.getBlocks()[0];
    if (!block) {
      editor.selection.setBlocks('<p />');
      block = selection.getBlocks()[0];
    }
    if (block.isEmpty && block.name !== 'p') {
      setParagraph(editor);
      return;
    }
    const rightText = selection.getRightText();
    selection.splitBlock();
    if (rightText !== '') {
      editor.history.save();
      editor.select();
      return;
    }
    block = selection.getBlocks()[0];
    if (block.isHeading) {
      setParagraph(editor);
      return;
    }
    if (block.isList && block.attr('type') === 'checklist') {
      block.find('li').attr('value', 'false');
    }
    editor.history.save();
    editor.select();
  });
};
