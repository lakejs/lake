import { type Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('codeBlock', {
    execute: () => {
      const box = editor.insertBox('codeBlock');
      if (!box) {
        return;
      }
      editor.history.save();
      const codeEditor = box.getData('codeEditor');
      codeEditor.focus();
    },
  });
};
