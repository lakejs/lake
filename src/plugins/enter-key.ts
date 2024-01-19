import type { Editor } from '..';
import { query } from '../utils';

function addBlockForBox(editor: Editor) {
  const range = editor.selection.range;
  const boxNode = range.startNode.closest('lake-box');
  const newBlock = query('<p><br /></p>');
  if (range.isBoxLeft) {
    boxNode.before(newBlock);
  } else if (range.isBoxRight) {
    boxNode.after(newBlock);
    range.shrinkAfter(newBlock);
  } else {
    editor.selection.removeBox();
  }
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('enter', event => {
    const range = editor.selection.range;
    if (range.isBoxCenter) {
      return;
    }
    event.preventDefault();
    if (range.isBox) {
      addBlockForBox(editor);
      editor.history.save();
      return;
    }
    range.adapt();
    if (range.isBox) {
      addBlockForBox(editor);
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
    editor.history.save();
  });
};
