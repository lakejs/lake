import { createIframeBox } from '@/utils/create-iframe-box';
import { Editor } from '@/editor';

function getId(url: string): string {
  const result = /\d+$/.exec(url || '');
  return result ? result[0] : '';
}

const twitterBox = createIframeBox({
  type: 'inline',
  name: 'twitter',
  width: 550,
  formDescription: locale => locale.twitter.description(),
  formLabel: locale => locale.twitter.url(),
  formPlaceholder: 'https://x.com/username/status/...',
  formButtonText: locale => locale.twitter.embed(),
  deleteButtonText: locale => locale.twitter.remove(),
  validUrl: url => (url.indexOf('https://x.com/') === 0 || url.indexOf('https://twitter.com/') === 0) && getId(url) !== '',
  urlError: locale => locale.twitter.urlError(),
  iframeAttributes: url => ({
    src: `https://platform.twitter.com/embed/Tweet.html?id=${getId(url)}`,
    scrolling: 'no',
    frameborder: '0',
    allowtransparency: 'true',
    allowfullscreen: 'true',
  }),
  beforeIframeLoad: iframeNode => {
    const messageListener = (event: MessageEvent) => {
      if (event.origin === 'https://platform.twitter.com') {
        const params = event.data['twttr.embed'].params;
        const width = params[0].width;
        const height = params[0].height;
        if (width > 0) {
          iframeNode.attr('width', `${width}`);
        }
        if (height > 0) {
          iframeNode.attr('height', `${height}`);
          window.removeEventListener('message', messageListener);
        }
      }
    };
    window.addEventListener('message', messageListener);
  },
});

export {
  twitterBox,
};

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('twitter', {
    execute: () => {
      const box = editor.selection.insertBox('twitter');
      editor.history.save();
      if (box) {
        box.getContainer().find('input[name="url"]').focus();
      }
    },
  });
};
