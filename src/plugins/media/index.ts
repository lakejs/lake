import { BoxValue } from '@/types/box';
import { Editor } from '@/editor';
import mediaBox from './media-box';

export {
  mediaBox,
};

export default (editor: Editor) => {
  editor.setPluginConfig('media', {
    requestMethod: 'POST',
    requestTypes: [
      'video/mp4',
      'video/mpeg',
      'video/webm',
      'video/ogg',
      'video/x-msvideo',
      'video/quicktime',
    ],
  });
  if (editor.readonly) {
    return;
  }
  editor.command.add('media', {
    execute: (value: BoxValue) => {
      editor.selection.insertBox('media', value);
      editor.history.save();
    },
  });
};
