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
  formDescription: 'Paste a link to embed a video from YouTube.',
  formLabel: 'URL',
  formPlaceholder: 'https://www.youtube.com/watch?v=...',
  formButtonText: 'Embed',
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

describe('utils / create-iframe-box-ui', () => {

  beforeEach(() => {
    boxes.set('youtube', youbuteBox);
  });

  it('youtube: should render an input field', () => {
    showBox('youtube', {}, box => {
      expect(box.name).to.equal('youtube');
    });
  });

  it('youtube: should render a loading status', () => {
    showBox('youtube', {
      url: 'loading',
    }, box => {
      expect(box.name).to.equal('youtube');
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
