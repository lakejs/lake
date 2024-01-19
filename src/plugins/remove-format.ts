import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('removeFormat', () => {
    editor.selection.removeMark();
    editor.history.save();
  });
};
