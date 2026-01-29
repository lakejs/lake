import { Editor, BoxValue, createIframeBox } from 'lakelib';

const truthsocialBox = createIframeBox({
  type: 'inline',
  name: 'truthsocial',
  width: '560px',
  height: '300px',
  formDescription: 'Paste your Truth Social link below.',
  urlLabel: 'Link',
  urlPlaceholder: 'https://truthsocial.com/username/posts/...',
  embedButtonText: 'Embed',
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
  beforeIframeLoad: box => {
    const boxContainer = box.getContainer();
    const placeholder = boxContainer.find('.lake-iframe-placeholder');
    const iframe = boxContainer.find('iframe');
    const messageListener = (event: MessageEvent) => {
      if (event.origin === 'https://truthsocial.com') {
        const height = event.data.height;
        if (height > 0) {
          placeholder.css('height', `${height}px`);
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
