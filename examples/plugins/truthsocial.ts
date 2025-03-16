import { BoxValue } from '@/types/box';
import { createIframeBox } from '@/utils/create-iframe-box';
import { Editor } from '@/editor';

const truthsocialBox = createIframeBox({
  type: 'inline',
  name: 'truthsocial',
  width: 560,
  height: 315,
  formDescription: 'Paste a link to embed a post from Truth Social.',
  formLabel: 'URL',
  formPlaceholder: 'https://truthsocial.com/username/posts/...',
  formButtonText: 'Embed',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('https://truthsocial.com/') === 0,
  urlError: 'Invalid Truth Social link',
  iframePlaceholder: '<span>Truth Social</span>',
  iframeAttributes: url => ({
    src: `${url.replace('/posts/', '/')}/embed`,
    scrolling: 'no',
    frameborder: '0',
    allowtransparency: 'true',
    allowfullscreen: 'true',
  }),
  beforeIframeLoad: iframe => {
    const messageListener = (event: MessageEvent) => {
      if (event.origin === 'https://truthsocial.com') {
        const height = event.data.height;
        if (height > 0) {
          iframe.css('height', `${height}px`);
          window.removeEventListener('message', messageListener);
        }
      }
    };
    window.addEventListener('message', messageListener);
  },
});

export {
  truthsocialBox,
};

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('truthsocial', {
    execute: (value?: BoxValue) => {
      const box = editor.selection.insertBox('truthsocial', value);
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
