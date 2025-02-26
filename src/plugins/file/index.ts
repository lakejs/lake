import { BoxValue } from '@/types/box';
import { Editor } from '@/editor';
import fileBox from './file-box';

export {
  fileBox,
};

export default (editor: Editor) => {
  editor.setPluginConfig('file', {
    requestMethod: 'POST',
    requestTypes: [
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.rar',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
      'text/plain',
      'text/html',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
  });
  if (editor.readonly) {
    return;
  }
  editor.command.add('file', {
    execute: (value: BoxValue) => {
      editor.selection.insertBox('file', value);
      editor.history.save();
    },
  });
};
