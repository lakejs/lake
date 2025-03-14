import { icons } from '@/icons';
import { createIframeBox } from '@/utils/create-iframe-box';
import { showBox } from '../utils';
import { Editor } from '@/editor';

const watchUrl = 'https://www.youtube.com/watch?v=5sMBhDv4sik';
const embedUrl = 'https://www.youtube.com/embed/5sMBhDv4sik';

const youbuteBox = createIframeBox({
  type: 'inline',
  name: 'youtubeBox',
  width: 560,
  height: 315,
  formDescription: 'Paste a link to embed a video from YouTube.',
  formLabel: 'URL',
  formPlaceholder: 'https://www.youtube.com/watch?v=...',
  formButtonText: 'Embed',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('https://www.youtube.com/') === 0,
  urlError: 'Invalid YouTube link',
  iframePlaceholder: icons.get('video'),
  iframeAttributes: () => ({
    src: embedUrl,
    title: 'YouTube video player',
    frameborder: '0',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    referrerpolicy: 'strict-origin-when-cross-origin',
    allowfullscreen: 'true',
  }),
  resize: true,
});

/*
const truthsocialBox = createIframeBox({
  type: 'inline',
  name: 'truthsocialBox',
  width: 560,
  height: 315,
  formDescription: 'Paste a link to embed a post from Truth Social.',
  formLabel: 'URL',
  formPlaceholder: 'https://truthsocial.com/username/posts/...',
  formButtonText: 'Embed',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('https://truthsocial.com/') === 0,
  urlError: 'Invalid Truth Social link',
  iframePlaceholder: icons.get('twitter'),
  iframeAttributes: () => ({
    src: 'https://truthsocial.com/@realDonaldTrump/114156036814880330/embed',
    frameborder: '0',
    allowfullscreen: 'true',
  }),
});
*/

Editor.box.add(youbuteBox);
// Editor.box.add(truthsocialBox);

describe('utils / create-iframe-box-ui', () => {

  it('youtube: should render an input field', () => {
    showBox('youtubeBox', {}, box => {
      expect(box.name).to.equal('youtubeBox');
    });
  });

  it('youtube: should render a video', () => {
    showBox('youtubeBox', {
      url: watchUrl,
    }, box => {
      expect(box.name).to.equal('youtubeBox');
    });
  });

  /*
  it('truthsocial: should render a post', () => {
    showBox('truthsocialBox', {
      url: 'https://truthsocial.com/@realDonaldTrump/posts/114156036814880330',
    }, box => {
      expect(box.name).to.equal('truthsocialBox');
    });
  });
  */

  it('youtube (read-only): should not display box without URL', () => {
    showBox('youtubeBox', {}, box => {
      expect(box.name).to.equal('youtubeBox');
    }, true);
  });

  it('youtube (read-only): should render a video', () => {
    showBox('youtubeBox', {
      url: watchUrl,
    }, box => {
      expect(box.name).to.equal('youtubeBox');
    }, true);
  });

});
