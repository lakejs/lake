import type Editor from '..';
import { query } from '../utils';

function setParagraph(editor: Editor) {
  editor.selection.setBlocks('<p />');
  editor.history.save();
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('enter', event => {
    event.preventDefault();
    const selection = editor.selection;
    const range = selection.range;
    if (range.isBox) {
      const boxNode = range.startNode.closest('lake-box');
      const newBlock = query('<p><br /></p>');
      if (range.isBoxLeft) {
        boxNode.before(newBlock);
      } else {
        boxNode.after(newBlock);
        range.shrinkAfter(newBlock);
      }
      editor.history.save();
      return;
    }
    range.adapt();
    let block = range.getBlocks()[0];
    if (!block) {
      editor.selection.setBlocks('<p />');
      block = range.getBlocks()[0];
    }
    if (block.isEmpty && block.name !== 'p') {
      setParagraph(editor);
      return;
    }
    const rightText = range.getRightText();
    selection.splitBlock();
    if (rightText !== '') {
      editor.history.save();
      return;
    }
    block = range.getBlocks()[0];
    if (block.isHeading) {
      setParagraph(editor);
      return;
    }
    if (block.isList && block.attr('type') === 'checklist') {
      block.find('li').attr('value', 'false');
    }
    editor.history.save();
  });
};
