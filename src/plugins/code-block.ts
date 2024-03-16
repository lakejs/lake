import { type Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('codeBlock', () => {
    const box = editor.selection.insertBox('codeBlock');
    if (!box) {
      return;
    }
    editor.history.save();
    const codeEditor = box.getData('codeEditor');
    codeEditor.focus();
  });
};
