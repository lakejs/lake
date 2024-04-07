import { type Editor } from '..';
import { BoxValue } from '../types/box';

export default (editor: Editor) => {
  editor.command.add('codeBlock', {
    execute: (value: BoxValue) => {
      const box = editor.insertBox('codeBlock', value);
      if (!box) {
        return;
      }
      editor.history.save();
      const codeEditor = box.getData('codeEditor');
      codeEditor.focus();
    },
  });
};
