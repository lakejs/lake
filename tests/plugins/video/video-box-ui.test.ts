import { showBox } from '../../utils';

const youtubeUrl = 'https://www.youtube.com/watch?v=5sMBhDv4sik';

describe('plugins / video / video-box-ui', () => {

  it('no URL', () => {
    showBox('video', {}, box => {
      expect(box.name).to.equal('video');
    });
  });

  it('has URL: should display video', () => {
    showBox('video', {
      url: youtubeUrl,
    }, box => {
      expect(box.name).to.equal('video');
    });
  });

  it('no URL (read-only): should not display box', () => {
    showBox('video', {}, box => {
      expect(box.name).to.equal('video');
    }, true);
  });

  it('has URL(read-only): should display video', () => {
    showBox('video', {
      url: youtubeUrl,
    }, box => {
      expect(box.name).to.equal('video');
    }, true);
  });

});
