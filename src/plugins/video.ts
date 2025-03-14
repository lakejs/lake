import { BoxValue } from '@/types/box';
import { icons } from '@/icons';
import { createIframeBox } from '@/utils/create-iframe-box';
import { Editor } from '@/editor';

/**
 * Extracts ID from the specified URL.
 */
function getId(url: string): string {
  const result = /[\w\-]+$/.exec(url || '');
  return result ? result[0] : '';
}

const videoBox = createIframeBox({
  type: 'inline',
  name: 'video',
  width: 560,
  height: 315,
  formDescription: locale => locale.video.description(),
  formLabel: locale => locale.video.url(),
  formPlaceholder: 'https://www.youtube.com/watch?v=...',
  formButtonText: locale => locale.video.embed(),
  deleteButtonText: locale => locale.video.remove(),
  validUrl: url => url.indexOf('https://www.youtube.com/') === 0 && getId(url) !== '',
  urlError: locale => locale.video.urlError(),
  iframePlaceholder: icons.get('video'),
  iframeAttributes: url => ({
    src: `https://www.youtube.com/embed/${getId(url)}`,
    title: 'YouTube video player',
    frameborder: '0',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    referrerpolicy: 'strict-origin-when-cross-origin',
    allowfullscreen: 'true',
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
    execute: (value?: BoxValue) => {
      const box = editor.selection.insertBox('video', value);
      editor.history.save();
      if (box) {
        const urlInput = box.getContainer().find('input[name="url"]');
        if (urlInput.length > 0) {
          urlInput.focus();
        }
      }
    },
  });
};
