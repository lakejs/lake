import { BoxValue } from '@/types/box';
import { icons } from '@/icons';
import { createIframeBox } from '@/utils/create-iframe-box';
import { Editor } from '@/editor';

/**
 * Extracts ID from the specified URL.
 */
function getId(url: string): string {
  const result = /\d+$/.exec(url || '');
  return result ? result[0] : '';
}

/**
 * Returns the current theme.
 */
function getTheme(): string {
  return document.documentElement.classList.contains('lake-dark') ? 'dark' : 'light';
}

const twitterBox = createIframeBox({
  type: 'inline',
  name: 'twitter',
  width: '550px',
  height: '300px',
  formDescription: locale => locale.twitter.description(),
  urlLabel: locale => locale.twitter.url(),
  urlPlaceholder: 'https://x.com/username/status/...',
  embedButtonText: locale => locale.twitter.embed(),
  deleteButtonText: locale => locale.twitter.remove(),
  validUrl: url => (url.indexOf('https://x.com/') === 0 || url.indexOf('https://twitter.com/') === 0) && getId(url) !== '',
  urlError: locale => locale.twitter.urlError(),
  iframePlaceholder: icons.get('twitter'),
  iframeAttributes: url => {
    return {
      src: `https://platform.twitter.com/embed/Tweet.html?id=${getId(url)}&theme=${getTheme()}`,
      title: 'Twitter tweet',
      scrolling: 'no',
      frameborder: '0',
      allowtransparency: 'true',
      allowfullscreen: 'true',
    };
  },
  beforeIframeLoad: box => {
    const boxContainer = box.getContainer();
    const placeholder = boxContainer.find('.lake-iframe-placeholder');
    const iframe = boxContainer.find('iframe');
    if (getTheme() === 'dark') {
      iframe.css('border-radius', '13px');
    }
    const messageListener = (event: MessageEvent) => {
      if (event.origin === 'https://platform.twitter.com') {
        const params = event.data['twttr.embed'].params;
        const height = params[0].height;
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
