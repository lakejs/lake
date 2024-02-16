import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('codeBlock', () => {
    editor.selection.insertBox('codeBlock');
    editor.history.save();
  });
};
