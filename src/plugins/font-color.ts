import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('fontColor', (value: string) => {
    editor.selection.addMark(`<span style="color: ${value};" />`);
    editor.history.save();
  });
};
