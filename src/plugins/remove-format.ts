import type { Editor } from 'lakelib/editor';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('removeFormat', {
    execute: () => {
      editor.selection.removeMark();
      editor.history.save();
    },
  });
};
