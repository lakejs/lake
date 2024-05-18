import { showBox } from '../utils';

const fileUrl = '../assets/files/heaven-lake-wikipedia.pdf';

describe('boxes / file-ui', () => {

  it('uploading status', () => {
    showBox('file', {
      url: fileUrl,
      status: 'uploading',
      name: 'Heaven Lake - Wikipedia.pdf',
      size: 747385,
      type: 'application/pdf',
      lastModified: 1715935215309,
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('uploading status (read-only): should not display', () => {
    showBox('file', {
      url: fileUrl,
      status: 'uploading',
      name: 'Heaven Lake - Wikipedia.pdf',
      size: 747385,
      type: 'application/pdf',
      lastModified: 1715935215309,
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
    }, true);
  });

  it('done status', () => {
    showBox('file', {
      url: fileUrl,
      status: 'done',
      name: 'Heaven Lake - Wikipedia.pdf',
      size: 747385,
      type: 'application/pdf',
      lastModified: 1715935215309,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('done status (read-only)', () => {
    showBox('file', {
      url: fileUrl,
      status: 'done',
      name: 'Heaven Lake - Wikipedia.pdf',
      size: 747385,
      type: 'application/pdf',
      lastModified: 1715935215309,
    }, box => {
      expect(box.value.status).to.equal('done');
    }, true);
  });

  it('error status', () => {
    showBox('file', {
      url: fileUrl,
      status: 'error',
      name: 'Heaven Lake - Wikipedia.pdf',
      size: 747385,
      type: 'application/pdf',
      lastModified: 1715935215309,
    }, box => {
      expect(box.value.status).to.equal('error');
    });
  });

  it('error status (read-only): should not display', () => {
    showBox('file', {
      url: fileUrl,
      status: 'error',
      name: 'Heaven Lake - Wikipedia.pdf',
      size: 747385,
      type: 'application/pdf',
      lastModified: 1715935215309,
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
    }, true);
  });

});
