import type Editor from '..';
import { adjustStartAttributes } from './list';

function setParagraph(editor: Editor) {
  editor.selection.setBlocks('<p />');
  adjustStartAttributes(editor);
  editor.history.save();
  editor.select();
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('enter', event => {
    event.preventDefault();
    const selection = editor.selection;
    let block = selection.getBlocks()[0];
    if (!block) {
      setParagraph(editor);
      return;
    }
    if (block.isEmpty && block.name !== 'p') {
      setParagraph(editor);
      return;
    }
    const rightText = selection.getRightText();
    selection.splitBlock();
    if (rightText !== '') {
      adjustStartAttributes(editor);
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
    adjustStartAttributes(editor);
    editor.history.save();
    editor.select();
  });
};
