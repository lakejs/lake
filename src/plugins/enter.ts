import type Editor from '..';
import { query } from '../utils';

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
    range.adapt();
    if (range.isBoxLeft) {
      const boxNode = range.startNode.closest('lake-box');
      const prevBlock = query('<p><br /></p>');
      boxNode.before(prevBlock);
      editor.history.save();
      editor.select();
      return;
    }
    if (range.isBoxRight) {
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
    const rightText = range.getRightText();
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
