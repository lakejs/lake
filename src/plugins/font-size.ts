import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('fontSize', (value: string) => {
    editor.selection.addMark(`<span style="font-size: ${value};" />`);
    editor.history.save();
  });
};
