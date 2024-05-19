import { showBox } from '../utils';

const youtubeUrl = 'https://www.youtube.com/watch?v=5sMBhDv4sik';

describe('boxes / video-ui', () => {

  it('no URL', () => {
    showBox('video', {}, box => {
      expect(box.name).to.equal('video');
    });
  });

  it('should display video', () => {
    showBox('video', {
      url: youtubeUrl,
    }, box => {
      expect(box.name).to.equal('video');
    });
  });

  it('read-only: should display video', () => {
    showBox('video', {
      url: youtubeUrl,
    }, box => {
      expect(box.name).to.equal('video');
    }, true);
  });

});
