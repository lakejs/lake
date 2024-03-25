import  type { Editor } from '../editor';
import { request } from '../utils/request';
import { Box } from '../models/box';

export function uploadImage(editor: Editor, file: File): Box | null {
  const { imageRequestMethod, imageRequestAction, imageRequestTypes } = editor.config;
  if (imageRequestTypes.indexOf(file.type) < 0) {
    throw new Error(`Cannot upload file because its type '${file.type}' is not found in ['${imageRequestTypes.join('\', \'')}'].`);
  }
  const box = editor.insertBox('image', {
    url: URL.createObjectURL(file),
    status: 'uploading',
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  });
  if (!box) {
    return box;
  }
  const xhr = request({
    onProgress: e => {
      const percentNode = box.node.find('.lake-percent');
      const percent = Math.round(e.percent);
      percentNode.text(`${percent < 100 ? percent : 99} %`);
    },
    onError: () => {
      box.updateValue('status', 'error');
      box.render();
    },
    onSuccess: body => {
      box.updateValue({
        status: 'done',
        url: body.url,
      });
      box.render();
      editor.history.save();
    },
    file,
    action: imageRequestAction,
    method: imageRequestMethod,
  });
  box.setData('xhr', xhr);
  return box;
}
