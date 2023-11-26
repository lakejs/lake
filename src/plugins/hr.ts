import type Editor from '..';

export default (editor: Editor) => {
  editor.box.add({
    type: 'block',
    name: 'hr',
    render: () => '<hr />',
  });
  editor.command.add('hr', () => {
    editor.focus();
    editor.selection.insertBox('hr');
    editor.history.save();
    editor.select();
  });
};
