import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('selectAll', () => {
    editor.selection.range.selectNodeContents(editor.container);
    editor.history.save();
  });
  editor.keystroke.setKeydown('mod+a', event => {
    event.preventDefault();
    editor.command.execute('selectAll');
  });
};
