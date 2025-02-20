import { BoxValue } from '@/types/box';
import { Editor } from '@/editor';
import videoBox from './video-box';

export {
  videoBox,
};

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
