import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('redo', () => {
    editor.history.redo();
  });
  editor.keystroke.setKeydown('mod+y', event => {
    event.preventDefault();
    editor.command.execute('redo');
  });
};
