import type { Editor } from '../editor';
import { debug } from '../utils/debug';
import { request } from '../utils/request';
import { Box } from '../models/box';

interface UploadConfig {
  editor: Editor;
  pluginName: string;
  file: File;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

// Uploads a file to the server.
export function uploadFile(config: UploadConfig): Box {
  const { editor, pluginName, file, onError, onSuccess } = config;
  const {
    requestMethod, requestAction, requestTypes,
    fieldName, transformResponse, withCredentials, headers,
  } = editor.config[pluginName];
  if (requestTypes.indexOf(file.type) < 0) {
    if (onError) {
      onError(`File "${file.name}" is not allowed for uploading.`);
    }
    throw new Error(`Cannot upload file "${file.name}" because its type "${file.type}" is not found in ['${requestTypes.join('\', \'')}'].`);
  }
  const box = editor.selection.insertBox(pluginName, {
    url: pluginName === 'image' ? URL.createObjectURL(file) : '',
    status: 'uploading',
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  });
  let xhr: XMLHttpRequest | null = request({
    onProgress: e => {
      const percentNode = box.node.find('.lake-percent');
      const percent = Math.round(e.percent);
      percentNode.text(`${percent < 100 ? percent : 99} %`);
    },
    onError: (error, body) => {
      xhr = null;
      debug(error.toString(), body);
      box.updateValue('status', 'error');
      box.render();
      if (onError) {
        onError(error.toString());
      }
    },
    onSuccess: body => {
      xhr = null;
      if (transformResponse) {
        body = transformResponse(body);
      }
      if (!body.url) {
        box.updateValue('status', 'error');
        box.render();
        if (onError) {
          onError('Cannot find the url field.');
        }
        return;
      }
      box.updateValue({
        status: 'done',
        url: body.url,
      });
      box.render();
      editor.history.save();
      if (onSuccess) {
        onSuccess();
      }
    },
    file,
    action: requestAction,
    method: requestMethod,
    fieldName,
    withCredentials,
    headers,
  });
  box.event.on('beforeunmount', () => {
    if (xhr) {
      xhr.abort();
      debug('Upload canceled');
    }
  });
  return box;
}
