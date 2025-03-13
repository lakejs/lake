import { createIframeBox } from '@/utils/create-iframe-box';
import { showBox } from '../utils';
import { Editor } from '@/editor';

const watchUrl = 'https://www.youtube.com/watch?v=5sMBhDv4sik';
const embedUrl = 'https://www.youtube.com/embed/5sMBhDv4sik';

const youbuteBox = createIframeBox({
  type: 'inline',
  name: 'youtubeBox',
  formDescription: 'Paste a link to embed a video from YouTube.',
  formLabel: 'URL',
  formPlaceholder: 'https://www.youtube.com/watch?v=...',
  formButtonText: 'Embed',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('https://www.youtube.com/') === 0,
  urlError: 'Invalid YouTube link',
  iframeAttributes: () => ({
    src: embedUrl,
  }),
  resize: true,
});

Editor.box.add(youbuteBox);

describe('utils / create-iframe-box-ui', () => {

  it('no URL', () => {
    showBox('youtubeBox', {}, box => {
      expect(box.name).to.equal('youtubeBox');
    });
  });

  it('has URL: should display box', () => {
    showBox('youtubeBox', {
      url: watchUrl,
    }, box => {
      expect(box.name).to.equal('youtubeBox');
    });
  });

  it('no URL (read-only): should not display box', () => {
    showBox('youtubeBox', {}, box => {
      expect(box.name).to.equal('youtubeBox');
    }, true);
  });

  it('has URL(read-only): should display box', () => {
    showBox('youtubeBox', {
      url: watchUrl,
    }, box => {
      expect(box.name).to.equal('youtubeBox');
    }, true);
  });

});
