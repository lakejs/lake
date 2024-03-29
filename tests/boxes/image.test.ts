import { testBox, click } from '../utils';
import { query } from '../../src/utils';
import { Editor, Nodes, Box } from '../../src';

const smallUrl = '../assets/images/heaven-lake-64.png';
const smallOriginalUrl = '../assets/images/heaven-lake-1280.png';
const mediumUrl = '../assets/images/heaven-lake-512.png';
const mediumOriginalUrl = '../assets/images/heaven-lake-1280.png';
const largeUrl = '../assets/images/lac-gentau-1024.jpg';
const largeOriginalUrl = '../assets/images/lac-gentau-4096.jpg';

describe('boxes / image', () => {

  let targetNode: Nodes;
  let editor: Editor;
  let box: Box | null;

  beforeEach(()=> {
    targetNode = query('<div class="lake-main" />');
    query(document.body).append(targetNode);
    editor = new Editor({
      root: targetNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    box = editor.insertBox('image', {
      url: mediumUrl,
      originalUrl: mediumOriginalUrl,
      originalWidth: 1024,
      originalHeight: 731,
      status: 'done',
      name: 'heaven-lake-512.png',
      size: 60008,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    });
  });

  afterEach(() => {
    // targetNode.remove();
  });

  it('should open full screen', done => {
    if (!box) {
      return;
    }
    const boxNode = box.node;
    box.event.on('render', () => {
      click(boxNode.find('.lake-button-view'));
    });
    box.event.on('openfullscreen', () => {
      click(query('.lake-pswp .pswp__button--close'));
      editor.unmount();
      done();
    });
  });

  it('should remove the box', done => {
    if (!box) {
      return;
    }
    const boxNode = box.node;
    box.event.on('render', () => {
      click(boxNode.find('.lake-button-remove'));
      const value = editor.getValue();
      editor.unmount();
      expect(value).to.equal('<p><br /><focus /></p>');
      done();
    });
  });

  it('should resize the image', done => {
    if (!box) {
      return;
    }
    const boxNode = box.node;
    box.event.on('render', () => {
      click(boxNode.find('.lake-image-img'));
      const oldWidth = boxNode.width();
      const pointerdownEvent = new PointerEvent('pointerdown', {
        pointerId: 1,
        clientX: 500,
        clientY: 500,
      });
      const pointermoveEvent = new PointerEvent('pointermove', {
        pointerId: 1,
        clientX: 300,
        clientY: 300,
      });
      const pointerupEvent = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 300,
        clientY: 300,
      });
      boxNode.find('.lake-resizer-bottom-right').emit('pointerdown', pointerdownEvent);
      boxNode.find('.lake-resizer-bottom-right').emit('pointermove', pointermoveEvent);
      boxNode.find('.lake-resizer-bottom-right').emit('pointerup', pointerupEvent);
      const newWidth = boxNode.width();
      editor.unmount();
      expect(newWidth).to.equal(oldWidth - 200);
      done();
    });
  });

});

describe('ui: boxes / image', () => {

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
      name: 'heaven-lake-512.png',
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
