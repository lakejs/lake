import { BoxValue } from 'lakelib/types/box';
import { Editor } from 'lakelib/editor';
import emojiBox from './emoji-box';

export {
  emojiBox,
};

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
