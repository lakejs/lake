import type { Editor } from '..';
import { BoxValue } from '../types/box';

export default (editor: Editor) => {
  if (!window.katex) {
    return;
  }
  if (editor.readonly) {
    return;
  }
  editor.command.add('equation', {
    execute: (value: BoxValue) => {
      const box = editor.selection.insertBox('equation', value);
      editor.history.save();
      const boxContainer = box.getContainer();
      boxContainer.find('.lake-equation-form').show('flex');
      boxContainer.find('textarea').focus();
    },
  });
};
