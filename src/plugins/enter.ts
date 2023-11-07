import type Editor from '..';

function setParagraph(editor: Editor) {
  editor.selection.setBlocks('<p />');
  editor.history.save();
  editor.select();
}

export default (editor: Editor) => {
  editor.keystroke.setKeydown('enter', event => {
    event.preventDefault();
    const selection = editor.selection;
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
