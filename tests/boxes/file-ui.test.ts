import { showBox } from '../utils';

describe('boxes / file-ui', () => {

  it('uploading status', () => {
    showBox('file', {
      url: 'smallUrl',
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
      url: 'smallUrl',
      status: 'done',
      name: 'heaven-lake-64.png',
      size: 10455,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('error status', () => {
    showBox('file', {
      url: 'smallUrl',
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
