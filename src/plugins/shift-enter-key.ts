import type { Editor } from '..';
import { query } from '../utils';

function addLineBreak(editor: Editor): void {
  const range = editor.selection.range;
  const block = range.startNode.closestBlock();
  if (block.length > 0 && !block.isContainer) {
    const prevNode = range.getPrevNode();
    const rightText = range.getRightText();
    if (prevNode.name !== 'br' && rightText === '') {
      editor.selection.insertContents('<br /><br />');
      editor.history.save();
      return;
    }
  }
  editor.selection.insertContents('<br />');
}

function addBlockOrLineBreakForBox(editor: Editor): void {
  const range = editor.selection.range;
  const boxNode = range.startNode.closest('lake-box');
  const block = boxNode.closestBlock();
  if (block.length > 0 && !block.isContainer) {
    if (range.isBoxLeft) {
      range.setStartBefore(boxNode);
      range.collapseToStart();
      addLineBreak(editor);
    } else if (range.isBoxRight) {
      range.setStartAfter(boxNode);
      range.collapseToStart();
      addLineBreak(editor);
    } else {
      editor.removeBox();
    }
    return;
  }
  const newBlock = query('<p><br /></p>');
  if (range.isBoxLeft) {
    boxNode.before(newBlock);
  } else if (range.isBoxRight) {
    boxNode.after(newBlock);
    range.shrinkAfter(newBlock);
  } else {
    editor.removeBox();
  }
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('shift+enter', event => {
    const range = editor.selection.range;
    if (range.isInoperative) {
      event.preventDefault();
      return;
    }
    if (range.isInsideBox) {
      return;
    }
    event.preventDefault();
    if (range.isBox) {
      addBlockOrLineBreakForBox(editor);
      editor.history.save();
      return;
    }
    range.adapt();
    if (range.isBox) {
      addBlockOrLineBreakForBox(editor);
      editor.history.save();
      return;
    }
    addLineBreak(editor);
    editor.history.save();
  });
};
