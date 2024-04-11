import { type Editor } from '..';
import { BoxValue } from '../types/box';

export default (editor: Editor) => {
  if (!window.CodeMirror) {
    return;
  }
  editor.command.add('codeBlock', {
    execute: (value: BoxValue) => {
      const box = editor.insertBox('codeBlock', value);
      editor.history.save();
      const codeEditor = box.getData('codeEditor');
      codeEditor.focus();
    },
  });
};
