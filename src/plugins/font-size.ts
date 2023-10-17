import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('fontSize', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="font-size: ${value};" />`);
    editor.history.save();
    editor.select();
  });
};
