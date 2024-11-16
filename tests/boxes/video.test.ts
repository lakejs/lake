import { isFirefox, click } from '../utils';
import { debug } from '../../src/utils/debug';
import { query } from '../../src/utils/query';
import { Editor, Nodes } from '../../src';

const youtubeUrl = 'https://www.youtube.com/watch?v=5sMBhDv4sik';

describe('boxes / video', () => {

  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(()=> {
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p>foo<focus />bar</p>',
    });
    editor.render();
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should embed a video', () => {
    const box = editor.selection.insertBox('video');
    const boxNode = box.node;
    boxNode.find('input[name="url"]').value(youtubeUrl);
    boxNode.find('button[name="embed"]').emit('click');
    expect(boxNode.find('iframe').length).to.equal(1);
  });

  it('should embed a video by pressing enter key', () => {
    const box = editor.selection.insertBox('video');
    const boxNode = box.node;
    boxNode.find('input[name="url"]').value(youtubeUrl);
    boxNode.find('input[name="url"]').emit('keydown', new KeyboardEvent('keydown', {
      key: 'Enter',
    }));
    expect(boxNode.find('iframe').length).to.equal(1);
  });

  it('should not embed a video that URL is invalid', () => {
    const box = editor.selection.insertBox('video');
    const boxNode = box.node;
    boxNode.find('input[name="url"]').value('invalid');
    boxNode.find('button[name="embed"]').emit('click');
    expect(boxNode.find('iframe').length).to.equal(0);
  });

  it('should remove the box', () => {
    const box = editor.selection.insertBox('video', {
      url: youtubeUrl,
      width: 500,
      height: 400,
    });
    const boxNode = box.node;
    boxNode.find('iframe').emit('load');
    click(boxNode.find('.lake-corner-toolbar button[name="remove"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p>foo<focus />bar</p>');
  });

  it('should resize the video', () => {
    const pointerId = isFirefox ? 0 : 1;
    const box = editor.selection.insertBox('video', {
      url: youtubeUrl,
      width: 500,
      height: 400,
    });
    const boxNode = box.node;
    boxNode.find('iframe').emit('load');
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
    expect(box.getContainer().css('width')).to.equal('300px');
    expect(box.node.find('iframe').attr('height')).to.equal('240');
    expect(box.value.width).to.equal(300);
    expect(box.value.height).to.equal(240);
  });

});
