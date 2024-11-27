import type { Editor } from 'lakelib/editor';
import { BoxValue } from 'lakelib/types/box';

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
