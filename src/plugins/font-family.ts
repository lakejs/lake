import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('fontFamily', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="font-family: ${value};" />`);
    editor.history.save();
    editor.select();
  });
};
