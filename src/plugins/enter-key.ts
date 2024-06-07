import type { Editor } from '..';
import { query } from '../utils';
import { Nodes } from '../models/nodes';

function splitBlock(editor: Editor, block: Nodes): void {
  const range = editor.selection.range;
  const endText = range.getEndText();
  editor.selection.splitBlock();
  block = range.getBlocks()[0];
  if (!block) {
    return;
  }
  if (endText === '' && (block.isHeading || block.name === 'blockquote')) {
    editor.selection.setBlocks('<p />');
    return;
  }
  if (block.isList && block.attr('type') === 'checklist') {
    block.find('li').attr('value', 'false');
  }
}

function addOrSplitBlockForBox(editor: Editor): void {
  const range = editor.selection.range;
  const boxNode = range.startNode.closest('lake-box');
  const block = boxNode.closestBlock();
  if (block.length > 0 && !block.isContainer) {
    if (range.isBoxStart) {
      range.setStartBefore(boxNode);
      range.collapseToStart();
      splitBlock(editor, block);
    } else if (range.isBoxEnd) {
      range.setStartAfter(boxNode);
      range.collapseToStart();
      splitBlock(editor, block);
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
  editor.keystroke.setKeydown('enter', event => {
    const range = editor.selection.range;
    if (range.isInsideBox) {
      return;
    }
    event.preventDefault();
    editor.fixContent();
    if (range.isBox) {
      addOrSplitBlockForBox(editor);
      editor.history.save();
      return;
    }
    range.adjust();
    if (range.isInoperative) {
      return;
    }
    if (range.isBox) {
      addOrSplitBlockForBox(editor);
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
