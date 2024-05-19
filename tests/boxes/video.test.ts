import { click } from '../utils';
import { query, debug } from '../../src/utils';
import { Editor, Nodes, Box } from '../../src';

const youtubeUrl = 'https://www.youtube.com/watch?v=5sMBhDv4sik';

describe('boxes / video', () => {

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
    box = editor.insertBox('video', {
      url: youtubeUrl,
      width: 500,
      height: 400,
    });
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should remove the box', () => {
    const boxNode = box.node;
    boxNode.find('iframe').emit('load');
    click(boxNode.find('.lake-button-remove'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p>foo<focus />bar</p>');
  });

  it('should resize the video', () => {
    const boxNode = box.node;
    boxNode.find('iframe').emit('load');
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
    expect(box.getContainer().css('width')).to.equal('300px');
    expect(box.node.find('iframe').attr('height')).to.equal('240');
    expect(box.value.width).to.equal(300);
    expect(box.value.height).to.equal(240);
  });

});
