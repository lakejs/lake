import type { Editor } from '..';
import { BoxValue } from '../types/box';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('video', {
    execute: (value: BoxValue) => {
      editor.insertBox('video', value);
      editor.history.save();
    },
  });
};
