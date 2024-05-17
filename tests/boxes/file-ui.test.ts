import { showBox } from '../utils';

const fileUrl = '../assets/images/heaven-lake-64.png';

describe('boxes / file-ui', () => {

  it('uploading status', () => {
    showBox('file', {
      url: fileUrl,
      status: 'uploading',
      name: 'heaven-lake-64.png',
      size: 1947946,
      type: 'image/png',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('done status', () => {
    showBox('file', {
      url: fileUrl,
      status: 'done',
      name: 'heaven-lake-64.png',
      size: 10455,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('done status (read-only)', () => {
    showBox('file', {
      url: fileUrl,
      status: 'done',
      name: 'heaven-lake-64.png',
      size: 10455,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('done');
    }, true);
  });

  it('error status', () => {
    showBox('file', {
      url: fileUrl,
      status: 'error',
      name: 'heaven-lake-64.png',
      size: 10455,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('error');
    });
  });

});
