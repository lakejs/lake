import { BoxValue } from '@/types/box';
import { icons } from '@/icons';
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
  iframePlaceholder: icons.get('twitter'),
  iframeAttributes: url => {
    const theme = document.documentElement.classList.contains('lake-dark') ? 'dark' : 'light';
    return {
      src: `https://platform.twitter.com/embed/Tweet.html?id=${getId(url)}&theme=${theme}`,
      title: 'Twitter tweet',
      scrolling: 'no',
      frameborder: '0',
      allowtransparency: 'true',
      allowfullscreen: 'true',
    };
  },
  beforeIframeLoad: iframeNode => {
    const theme = document.documentElement.classList.contains('lake-dark') ? 'dark' : 'light';
    if (theme === 'dark') {
      iframeNode.css('border-radius', '13px');
    }
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
    execute: (value?: BoxValue) => {
      const box = editor.selection.insertBox('twitter', value);
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
