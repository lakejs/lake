import { BoxValue } from '@/types/box';
import { createIframeBox } from '@/utils/create-iframe-box';
import { Editor } from '@/editor';

function getVideoId(url: string): string {
  const result = /\w+$/.exec(url || '');
  return result ? result[0] : '';
}

const videoBox = createIframeBox({
  type: 'inline',
  name: 'video',
  formDescription: locale => locale.video.description(),
  formLabel: locale => locale.video.url(),
  formPlaceholder: 'https://www.youtube.com/watch?v=...',
  formButtonText: locale => locale.video.embed(),
  deleteButtonText: locale => locale.video.remove(),
  validUrl: url => url.indexOf('https://www.youtube.com/') === 0 && getVideoId(url) !== '',
  urlError: locale => locale.video.urlError(),
  iframeAttributes: url => ({
    src: `https://www.youtube.com/embed/${getVideoId(url)}`,
  }),
  resize: true,
});

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
