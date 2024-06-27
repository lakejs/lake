import type { Editor } from '..';
import { BoxValue } from '../types/box';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('equation', {
    execute: (value: BoxValue) => {
      const box = editor.selection.insertBox('equation', value);
      editor.history.save();
      box.getContainer().find('.lake-equation-view').emit('click');
    },
  });
};
