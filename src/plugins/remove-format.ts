import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('removeFormat', {
    execute: () => {
      editor.selection.removeMark();
      editor.history.save();
    },
  });
};
