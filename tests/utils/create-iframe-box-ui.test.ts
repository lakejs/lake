import { icons } from '@/icons';
import { boxes } from '@/storage/boxes';
import { createIframeBox } from '@/utils/create-iframe-box';
import { showBox } from '../utils';

const youbuteUrl = 'https://www.youtube.com/watch?v=5sMBhDv4sik';

function getId(url: string): string {
  const result = /[\w\-]+$/.exec(url || '');
  return result ? result[0] : '';
}

const youbuteBox = createIframeBox({
  type: 'inline',
  name: 'youtube',
  width: '560px',
  height: '315px',
  formDescription: 'Paste a YouTube link to embed the video.',
  urlLabel: 'URL',
  urlPlaceholder: 'https://www.youtube.com/watch?v=...',
  embedButtonText: 'Embed',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('https://www.youtube.com/') === 0,
  urlError: 'Invalid YouTube link',
  iframePlaceholder: icons.get('video'),
  iframeAttributes: () => ({
    src: `https://www.youtube.com/embed/${getId(youbuteUrl)}`,
    title: 'YouTube video player',
    frameborder: '0',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    referrerpolicy: 'strict-origin-when-cross-origin',
    allowfullscreen: 'true',
  }),
  resize: true,
});

const codesandboxBox = createIframeBox({
  type: 'block',
  name: 'codesandbox',
  width: '100%',
  height: '500px',
  formDescription: 'Paste a CodeSandbox link to embed the running sandbox.',
  urlPlaceholder: 'https://codesandbox.io/p/sandbox/...',
  embedButtonText: 'Embed',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('https://codesandbox.io/') === 0,
  urlError: 'Invalid CodeSandbox URL',
  iframePlaceholder: '<span>CodeSandbox</span>',
  iframeAttributes: url => ({
    src: url.replace('/p/sandbox/', '/embed/'),
    scrolling: 'no',
    frameborder: '0',
    allow: 'accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking',
    sandbox: 'allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts',
  }),
});

describe('utils / create-iframe-box-ui', () => {

  beforeEach(() => {
    boxes.set('youtube', youbuteBox);
    boxes.set('codesandbox', codesandboxBox);
  });

  it('youtube: should render an input field', () => {
    showBox('youtube', {}, box => {
      expect(box.name).to.equal('youtube');
    });
  });

  it('codesandbox: should render an input field', () => {
    showBox('codesandbox', {}, box => {
      expect(box.name).to.equal('codesandbox');
    });
  });

  it('youtube: should render a loading status', () => {
    showBox('youtube', {
      url: 'loading',
    }, box => {
      expect(box.name).to.equal('youtube');
    });
  });

  it('codesandbox: should render a loading status', () => {
    showBox('codesandbox', {
      url: 'loading',
    }, box => {
      expect(box.name).to.equal('codesandbox');
    });
  });

  it('youtube: should render a video', () => {
    showBox('youtube', {
      url: youbuteUrl,
    }, box => {
      expect(box.name).to.equal('youtube');
    });
  });

  it('youtube (read-only): should not display box without URL', () => {
    showBox('youtube', {}, box => {
      expect(box.name).to.equal('youtube');
    }, true);
  });

  it('youtube (read-only): should render a video', () => {
    showBox('youtube', {
      url: youbuteUrl,
    }, box => {
      expect(box.name).to.equal('youtube');
    }, true);
  });

});
