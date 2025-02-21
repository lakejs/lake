import { showBox } from '../../utils';

const fileUrl = '../assets/files/think-different-wikipedia.pdf';

describe('plugins / file / file-box-ui', () => {

  it('uploading status', () => {
    showBox('file', {
      url: fileUrl,
      status: 'uploading',
      name: 'Think different - Wikipedia.pdf',
      size: 510558,
      type: 'application/pdf',
      lastModified: 1740097718598,
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('uploading status (read-only): should not display', () => {
    showBox('file', {
      url: fileUrl,
      status: 'uploading',
      name: 'Think different - Wikipedia.pdf',
      size: 510558,
      type: 'application/pdf',
      lastModified: 1740097718598,
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
    }, true);
  });

  it('done status', () => {
    showBox('file', {
      url: fileUrl,
      status: 'done',
      name: 'Think different - Wikipedia.pdf',
      size: 510558,
      type: 'application/pdf',
      lastModified: 1740097718598,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('done status (read-only)', () => {
    showBox('file', {
      url: fileUrl,
      status: 'done',
      name: 'Think different - Wikipedia.pdf',
      size: 510558,
      type: 'application/pdf',
      lastModified: 1740097718598,
    }, box => {
      expect(box.value.status).to.equal('done');
    }, true);
  });

  it('error status', () => {
    showBox('file', {
      url: fileUrl,
      status: 'error',
      name: 'Think different - Wikipedia.pdf',
      size: 510558,
      type: 'application/pdf',
      lastModified: 1740097718598,
    }, box => {
      expect(box.value.status).to.equal('error');
    });
  });

  it('error status (read-only): should not display', () => {
    showBox('file', {
      url: fileUrl,
      status: 'error',
      name: 'Think different - Wikipedia.pdf',
      size: 510558,
      type: 'application/pdf',
      lastModified: 1740097718598,
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
    }, true);
  });

});
