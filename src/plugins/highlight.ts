import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('highlight', (value: string) => {
    editor.selection.addMark(`<span style="background-color: ${value};" />`);
    editor.history.save();
  });
};
