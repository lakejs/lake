import type { Editor } from '..';
import { BoxValue } from '../types/box';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('video', {
    execute: (value: BoxValue) => {
      const box = editor.selection.insertBox('video', value);
      editor.history.save();
      if (box) {
        box.getContainer().find('input[name="url"]').focus();
      }
    },
  });
};
