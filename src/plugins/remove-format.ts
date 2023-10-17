import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('removeFormat', () => {
    editor.focus();
    editor.selection.removeMark();
    editor.history.save();
    editor.select();
  });
};
