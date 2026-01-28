import { showBox } from '../../utils';

const mediaUrl = '../assets/files/flower.mp4';

describe('plugins / media / media-box-ui', () => {

  it('uploading status', () => {
    showBox('media', {
      url: mediaUrl,
      status: 'uploading',
      name: 'flower.mp4',
      size: 510558,
      type: 'video/mp4',
      lastModified: 1740097718598,
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('uploading status (read-only): should not display', () => {
    showBox('media', {
      url: mediaUrl,
      status: 'uploading',
      name: 'flower.mp4',
      size: 510558,
      type: 'video/mp4',
      lastModified: 1740097718598,
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
    }, true);
  });

  it('done status', () => {
    showBox('media', {
      url: mediaUrl,
      status: 'done',
      name: 'flower.mp4',
      size: 510558,
      type: 'video/mp4',
      lastModified: 1740097718598,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('done status (read-only)', () => {
    showBox('media', {
      url: mediaUrl,
      status: 'done',
      name: 'flower.mp4',
      size: 510558,
      type: 'video/mp4',
      lastModified: 1740097718598,
    }, box => {
      expect(box.value.status).to.equal('done');
    }, true);
  });

  it('error status', () => {
    showBox('media', {
      url: mediaUrl,
      status: 'error',
      name: 'flower.mp4',
      size: 510558,
      type: 'video/mp4',
      lastModified: 1740097718598,
    }, box => {
      expect(box.value.status).to.equal('error');
    });
  });

  it('error status (read-only): should not display', () => {
    showBox('media', {
      url: mediaUrl,
      status: 'error',
      name: 'flower.mp4',
      size: 510558,
      type: 'video/mp4',
      lastModified: 1740097718598,
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
    }, true);
  });

});
