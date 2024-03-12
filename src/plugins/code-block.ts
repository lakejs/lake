import { type Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('codeBlock', () => {
    const box = editor.selection.insertBox('codeBlock');
    editor.history.save();
    const codeEditor = box.getData('codeEditor');
    codeEditor.focus();
  });
};
