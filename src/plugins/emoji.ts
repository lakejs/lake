import type { Editor } from '..';
import { BoxValue } from '../types/box';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('emoji', {
    execute: (value: BoxValue) => {
      editor.selection.insertBox('emoji', value);
      editor.history.save();
    },
  });
};
