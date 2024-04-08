import { click } from '../utils';
import { query } from '../../src/utils';
import { Editor, Nodes, Box } from '../../src';

const mediumUrl = '../assets/images/heaven-lake-512.png';
const mediumOriginalUrl = '../assets/images/heaven-lake-1280.png';

describe('boxes / image', () => {

  let rootNode: Nodes;
  let editor: Editor;
  let box: Box;

  beforeEach(()=> {
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
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
    editor.unmount();
    rootNode.remove();
  });

  it('should open full screen', done => {
    const boxNode = box.node;
    box.event.once('render', () => {
      click(boxNode.find('.lake-button-view'));
    });
    box.event.once('openfullscreen', () => {
      click(query('.lake-pswp .pswp__button--close'));
      done();
    });
  });

  it('should remove the box', done => {
    const boxNode = box.node;
    box.event.once('render', () => {
      click(boxNode.find('.lake-button-remove'));
      const value = editor.getValue();
      expect(value).to.equal('<p><br /><focus /></p>');
      done();
    });
  });

  it('should resize the image', done => {
    const boxNode = box.node;
    box.event.once('render', () => {
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
      expect(newWidth).to.equal(oldWidth - 200);
      done();
    });
  });

});
