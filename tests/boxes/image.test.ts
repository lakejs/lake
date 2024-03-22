import { expect } from 'chai';
import { testBox } from '../utils';

const smallUrl = '../assets/images/heaven-lake-64.png';
const smallOriginalUrl = '../assets/images/heaven-lake-1280.png';
const mediumUrl = '../assets/images/song-hye-kyo-512.jpg';
const mediumOriginalUrl = '../assets/images/song-hye-kyo-1024.jpg';
const largeUrl = '../assets/images/lac-gentau-1024.jpg';
const largeOriginalUrl = '../assets/images/lac-gentau-4096.jpg';

describe('boxes / image', () => {

  it('uploading: small size', () => {
    testBox('image', {
      url: smallUrl,
      status: 'uploading',
      name: 'heaven-lake-64.png',
      size: 1947946,
      type: 'image/png',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('uploading: medium size', () => {
    testBox('image', {
      url: mediumUrl,
      status: 'uploading',
      name: 'song-hye-kyo-512.jpg',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
      percent: 50.49,
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('uploading: large size', () => {
    testBox('image', {
      url: largeUrl,
      status: 'uploading',
      name: 'lac-gentau-4096.jpg',
      size: 1437727,
      type: 'image/jpeg',
      lastModified: 1710229517198,
      percent: 100,
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('loading: small size', () => {
    testBox('image', {
      url: smallUrl,
      width: 64,
      height: 46,
      status: 'loading',
    }, box => {
      expect(box.value.status).to.equal('loading');
    });
  });

  it('loading: medium size', () => {
    testBox('image', {
      url: smallUrl,
      width: 512,
      height: 366,
      status: 'loading',
    }, box => {
      expect(box.value.status).to.equal('loading');
    });
  });

  it('loading: large size', () => {
    testBox('image', {
      url: smallUrl,
      width: 1024,
      height: 670,
      status: 'loading',
    }, box => {
      expect(box.value.status).to.equal('loading');
    });
  });

  it('done: small size', () => {
    testBox('image', {
      url: smallUrl,
      originalUrl: smallOriginalUrl,
      originalWidth: 1280,
      originalHeight: 926,
      status: 'done',
      name: 'heaven-lake-64.png',
      size: 10455,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('done: medium size', () => {
    testBox('image', {
      url: mediumUrl,
      originalUrl: mediumOriginalUrl,
      originalWidth: 1024,
      originalHeight: 731,
      status: 'done',
      name: 'song-hye-kyo-512.jpg',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('done: large size', () => {
    testBox('image', {
      url: largeUrl,
      originalUrl: largeOriginalUrl,
      originalWidth: 4096,
      originalHeight: 2679,
      status: 'done',
      name: 'lac-gentau-4096.jpg',
      size: 1437727,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('error status', () => {
    testBox('image', {
      url: smallUrl,
      status: 'error',
      name: 'heaven-lake-64.png',
    }, box => {
      expect(box.value.status).to.equal('error');
    });
  });

});
