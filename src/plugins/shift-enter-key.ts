import type { Editor } from '..';
import { query } from '../utils';
import { Fragment } from '../models/fragment';

function addLineBreak(editor: Editor): void {
  const range = editor.selection.range;
  const block = range.startNode.closestBlock();
  if (block.length > 0 && !block.isContainer) {
    const prevNode = range.getPrevNode();
    const endText = range.getEndText();
    if (prevNode.name !== 'br' && endText === '') {
      const fragment = new Fragment();
      fragment.append('<br /><br />');
      editor.selection.insertFragment(fragment);
      editor.history.save();
      return;
    }
  }
  editor.selection.insertNode(query('<br />'));
}

function addBlockOrLineBreakForBox(editor: Editor): void {
  const range = editor.selection.range;
  const boxNode = range.startNode.closest('lake-box');
  const block = boxNode.closestBlock();
  if (block.length > 0 && !block.isContainer) {
    if (range.isBoxStart) {
      range.setStartBefore(boxNode);
      range.collapseToStart();
      addLineBreak(editor);
    } else if (range.isBoxEnd) {
      range.setStartAfter(boxNode);
      range.collapseToStart();
      addLineBreak(editor);
    } else {
      editor.selection.removeBox();
    }
    return;
  }
  const newBlock = query('<p><br /></p>');
  if (range.isBoxStart) {
    boxNode.before(newBlock);
  } else if (range.isBoxEnd) {
    boxNode.after(newBlock);
    range.shrinkAfter(newBlock);
  } else {
    editor.selection.removeBox();
  }
}

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.keystroke.setKeydown('shift+enter', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    editor.fixContent();
    event.preventDefault();
    if (range.isBox) {
      addBlockOrLineBreakForBox(editor);
      editor.history.save();
      return;
    }
    range.adjust();
    if (range.isInoperative) {
      return;
    }
    if (range.isBox) {
      addBlockOrLineBreakForBox(editor);
      editor.history.save();
      return;
    }
    addLineBreak(editor);
    editor.history.save();
  });
};
