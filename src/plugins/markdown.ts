import type Editor from '..';

export default (editor: Editor) => {
  editor.keystroke.setKeyup('space', event => {
    event.preventDefault();
    const selection = editor.selection;
    const leftText = selection.getLeftText();
    if (leftText === '# ') {
      editor.history.save();
      selection.setBlocks('<h1 />');
      selection.fixList();
      editor.history.save();
      editor.select();
    }
  });
};
