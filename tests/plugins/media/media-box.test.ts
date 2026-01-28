import { debug } from '@/utils/debug';
import { query } from '@/utils/query';
import { Nodes } from '@/models/nodes';
import { Box } from '@/models/box';
import { Editor } from '@/editor';
import { isFirefox, click } from '../../utils';

const mediaUrl = '../assets/files/flower.mp4';

describe('plugins / media / media-box', () => {

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
    box = editor.selection.insertBox('media', {
      url: mediaUrl,
      status: 'done',
      name: 'flower.mp4',
      size: 60008,
      type: 'video/mp4',
      lastModified: 1710229517198,
    });
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('corner-toolbar: should remove the box', () => {
    click(box.node.find('.lake-corner-toolbar button[name="remove"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p>foo<focus />bar</p>');
  });

  it('resizer: should resize the video', () => {
    const pointerId = isFirefox ? 0 : 1;
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
  });

});
