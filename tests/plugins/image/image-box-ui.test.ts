import { showBox } from '../../utils';

const smallUrl = '../assets/images/heaven-lake-64.png';
const smallOriginalUrl = '../assets/images/heaven-lake-1280.png';
const mediumUrl = '../assets/images/heaven-lake-512.png';
const mediumOriginalUrl = '../assets/images/heaven-lake-1280.png';
const largeUrl = '../assets/images/lac-gentau-1024.jpg';
const largeOriginalUrl = '../assets/images/lac-gentau-4096.jpg';

describe('plugins / image / image-box-ui', () => {

  it('uploading: small size', () => {
    showBox('image', {
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
    showBox('image', {
      url: mediumUrl,
      status: 'uploading',
      name: 'heaven-lake-512.png',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
      percent: 50.49,
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('uploading: large size', () => {
    showBox('image', {
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

  it('uploading (read-only): should not display', () => {
    showBox('image', {
      url: mediumUrl,
      status: 'uploading',
      name: 'heaven-lake-512.png',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
      percent: 50.49,
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
    }, true);
  });

  it('loading: small size', () => {
    showBox('image', {
      url: smallUrl,
      width: 64,
      height: 46,
      status: 'loading',
    }, box => {
      expect(box.value.status).to.equal('loading');
    });
  });

  it('loading: medium size', () => {
    showBox('image', {
      url: smallUrl,
      width: 512,
      height: 366,
      status: 'loading',
    }, box => {
      expect(box.value.status).to.equal('loading');
    });
  });

  it('loading: large size', () => {
    showBox('image', {
      url: smallUrl,
      width: 1024,
      height: 670,
      status: 'loading',
    }, box => {
      expect(box.value.status).to.equal('loading');
    });
  });

  it('loading (read-only): should not display', () => {
    showBox('image', {
      url: smallUrl,
      width: 1024,
      height: 670,
      status: 'loading',
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
    }, true);
  });

  it('done: small size', () => {
    showBox('image', {
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

  it('done: medium size without caption', () => {
    showBox('image', {
      url: mediumUrl,
      originalUrl: mediumOriginalUrl,
      originalWidth: 1024,
      originalHeight: 731,
      status: 'done',
      name: 'heaven-lake-512.png',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('done: medium size with caption', () => {
    showBox('image', {
      url: mediumUrl,
      originalUrl: mediumOriginalUrl,
      originalWidth: 1024,
      originalHeight: 731,
      status: 'done',
      name: 'heaven-lake-512.png',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
      caption: 'Heaven Lake is a volcanic crater lake atop Changbai Mountain. In Korea, it is known as Paektu Mountain or Baekdu Mountain.',
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('done: large size', () => {
    showBox('image', {
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

  it('done (read-only): medium size without caption', () => {
    showBox('image', {
      url: mediumUrl,
      originalUrl: mediumOriginalUrl,
      originalWidth: 1024,
      originalHeight: 731,
      status: 'done',
      name: 'heaven-lake-512.png',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('done');
    }, true);
  });

  it('done (read-only): medium size with caption', () => {
    showBox('image', {
      url: mediumUrl,
      originalUrl: mediumOriginalUrl,
      originalWidth: 1024,
      originalHeight: 731,
      status: 'done',
      name: 'heaven-lake-512.png',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
      caption: 'Heaven Lake is a volcanic crater lake atop Changbai Mountain. In Korea, it is known as Paektu Mountain or Baekdu Mountain.',
    }, box => {
      expect(box.value.status).to.equal('done');
    }, true);
  });

  it('error status', () => {
    showBox('image', {
      url: smallUrl,
      status: 'error',
      name: 'heaven-lake-64.png',
    }, box => {
      expect(box.value.status).to.equal('error');
    });
  });

  it('error status (read-only): should not display', () => {
    showBox('image', {
      url: smallUrl,
      status: 'error',
      name: 'heaven-lake-64.png',
    }, box => {
      expect(box.node.computedCSS('display')).to.equal('none');
    }, true);
  });

});
