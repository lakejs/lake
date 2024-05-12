import type { Editor } from '..';
import { BoxValue } from '../types/box';

export default (editor: Editor) => {
  editor.setPluginConfig('file', {
    requestMethod: 'POST',
    requestTypes: [
      'application/zip',
      'application/vnd.rar',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
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
      editor.insertBox('file', value);
      editor.history.save();
    },
  });
};
