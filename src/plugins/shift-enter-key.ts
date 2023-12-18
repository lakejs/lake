import type Editor from '..';

export default (editor: Editor) => {
  editor.keystroke.setKeydown('shift+enter', event => {
    event.preventDefault();
    editor.selection.insertContents('<br />\u200B');
    editor.history.save();
    editor.select();
  });
};
