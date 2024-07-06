import { isFirefox, click, removeBoxValueFromHTML } from '../utils';
import { query, debug } from '../../src/utils';
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
      value: '<p>foo<focus />bar</p>',
    });
    editor.render();
    box = editor.selection.insertBox('image', {
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
    box.event.once('closefullscreen', () => {
      const value = removeBoxValueFromHTML(editor.getValue());
      debug(`output: ${value}`);
      expect(value).to.equal('<p>foo<lake-box type="inline" name="image" focus="center"></lake-box>bar</p>');
      done();
    });
    box.event.once('openfullscreen', () => {
      click(query('.lake-pswp .pswp__button--close'));
    });
  });

  it('should remove the box', done => {
    const boxNode = box.node;
    box.event.once('render', () => {
      click(boxNode.find('.lake-button-remove'));
      const value = editor.getValue();
      debug(`output: ${value}`);
      expect(value).to.equal('<p>foo<focus />bar</p>');
      done();
    });
  });

  it('should resize the image', done => {
    const pointerId = isFirefox ? 0 : 1;
    const boxNode = box.node;
    box.event.once('render', () => {
      click(boxNode.find('.lake-image-img'));
      const oldWidth = boxNode.width();
      const pointerdownEvent = new PointerEvent('pointerdown', {
        pointerId,
        clientX: 500,
        clientY: 500,
      });
      const pointermoveEvent = new PointerEvent('pointermove', {
        pointerId,
        clientX: 300,
        clientY: 300,
      });
      const pointerupEvent = new PointerEvent('pointerup', {
        pointerId,
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
