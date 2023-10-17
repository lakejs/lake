import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('undo', () => {
    editor.focus();
    editor.history.undo();
    editor.select();
  });
  editor.keystroke.setKeydown('mod+z', event => {
    event.preventDefault();
    editor.command.execute('undo');
  });
};
