import type Editor from '..';
import { query } from '../utils';

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
      editor.selection.setBlocks('<p />');
      editor.history.save();
      return;
    }
    const rightText = range.getRightText();
    selection.splitBlock();
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
