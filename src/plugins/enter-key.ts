import type { Editor } from '..';
import { query } from '../utils';
import { Nodes } from '../models/nodes';

function splitBlock(editor: Editor, block: Nodes): void {
  const range = editor.selection.range;
  const rightText = range.getRightText();
  editor.selection.splitBlock();
  block = range.getBlocks()[0];
  if (!block) {
    editor.history.save();
    return;
  }
  if (rightText === '' && block.isHeading) {
    editor.selection.setBlocks('<p />');
    editor.history.save();
    return;
  }
  if (block.isList && block.attr('type') === 'checklist') {
    block.find('li').attr('value', 'false');
  }
}

function addBlockOrSplitBlockForBox(editor: Editor): void {
  const range = editor.selection.range;
  const boxNode = range.startNode.closest('lake-box');
  const block = boxNode.closestBlock();
  if (block.length > 0 && !block.isContainer) {
    if (range.isBoxLeft) {
      range.setStartBefore(boxNode);
      range.collapseToStart();
      splitBlock(editor, block);
    } else if (range.isBoxRight) {
      range.setStartAfter(boxNode);
      range.collapseToStart();
      splitBlock(editor, block);
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
  editor.keystroke.setKeydown('enter', event => {
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
      addBlockOrSplitBlockForBox(editor);
      editor.history.save();
      return;
    }
    range.adapt();
    if (range.isBox) {
      addBlockOrSplitBlockForBox(editor);
      editor.history.save();
      return;
    }
    let block = range.getBlocks()[0];
    if (!block) {
      editor.selection.setBlocks('<p />');
      block = range.getBlocks()[0];
    }
    if (block.isEmpty && block.name !== 'p') {
      editor.selection.setBlocks('<p />');
      editor.history.save();
      return;
    }
    splitBlock(editor, block);
    editor.history.save();
  });
};
