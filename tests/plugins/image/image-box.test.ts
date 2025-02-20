import { debug } from '@/utils/debug';
import { query } from '@/utils/query';
import { Nodes } from '@/models/nodes';
import { Box } from '@/models/box';
import { Editor } from '@/editor';
import { isFirefox, click, removeBoxValueFromHTML } from '../../utils';

const mediumUrl = '../assets/images/heaven-lake-512.png';
const mediumOriginalUrl = '../assets/images/heaven-lake-1280.png';

describe('plugins / image / image-box', () => {

  let rootNode: Nodes;
  let editor: Editor;
  let box: Box;

  beforeEach(() => {
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
      width: 512,
      height: 365,
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

  it('corner-toolbar: should open full screen', done => {
    box.event.once('closefullscreen', () => {
      const value = removeBoxValueFromHTML(editor.getValue());
      debug(`output: ${value}`);
      expect(value).to.equal('<p>foo<lake-box type="inline" name="image" focus="center"></lake-box>bar</p>');
      done();
    });
    box.event.once('openfullscreen', () => {
      click(query('.lake-pswp .pswp__button--close'));
    });
    box.event.once('render', () => {
      click(box.node.find('.lake-corner-toolbar button[name="view"]'));
    });
  });

  it('corner-toolbar: should remove the box', done => {
    box.event.once('render', () => {
      click(box.node.find('.lake-corner-toolbar button[name="remove"]'));
      const value = editor.getValue();
      debug(`output: ${value}`);
      expect(value).to.equal('<p>foo<focus />bar</p>');
      done();
    });
  });

  it('resizer: should resize the image', done => {
    const pointerId = isFirefox ? 0 : 1;
    box.event.once('render', () => {
      const oldWidth = box.node.width();
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
      box.node.find('.lake-resizer-bottom-right').emit('pointerdown', pointerdownEvent);
      box.node.find('.lake-resizer-bottom-right').emit('pointermove', pointermoveEvent);
      box.node.find('.lake-resizer-bottom-right').emit('pointerup', pointerupEvent);
      const newWidth = box.node.width();
      expect(newWidth).to.equal(oldWidth - 200);
      done();
    });
  });

  it('floating-toolbar: should show caption', done => {
    box.event.once('renderfloatingtoolbar', () => {
      expect(box.toolbar !== null).to.equal(true);
      if (!box.toolbar) {
        return done();
      }
      click(box.toolbar.root.find('button[name="caption"]'));
      expect(box.node.find('.lake-image-caption').computedCSS('display')).to.equal('block');
      done();
    });
    box.event.once('render', () => {
      window.setTimeout(() => {
        click(box.node.find('.lake-image-img'));
      }, 50);
    });
  });

  it('floating-toolbar: should align to center', done => {
    box.event.once('renderfloatingtoolbar', () => {
      expect(box.toolbar !== null).to.equal(true);
      if (!box.toolbar) {
        return done();
      }
      click(box.toolbar.root.find('div[name="align"] .lake-dropdown-title'));
      click(box.toolbar.root.find('div[name="align"] li[value="center"]'));
      const value = removeBoxValueFromHTML(editor.getValue());
      debug(`output: ${value}`);
      expect(value).to.equal('<p style="text-align: center;">foo<lake-box type="inline" name="image" focus="center"></lake-box>bar</p>');
      done();
    });
    box.event.once('render', () => {
      window.setTimeout(() => {
        click(box.node.find('.lake-image-img'));
      }, 50);
    });
  });

  it('floating-toolbar: should resize', done => {
    box.event.once('renderfloatingtoolbar', () => {
      expect(box.toolbar !== null).to.equal(true);
      if (!box.toolbar) {
        return done();
      }
      expect(box.value.width).to.equal(512);
      click(box.toolbar.root.find('div[name="resize"] .lake-dropdown-title'));
      click(box.toolbar.root.find('div[name="resize"] li[value="1.00"]'));
      expect(box.value.width).to.equal(1024);
      done();
    });
    box.event.once('render', () => {
      window.setTimeout(() => {
        click(box.node.find('.lake-image-img'));
      }, 50);
    });
  });

});
