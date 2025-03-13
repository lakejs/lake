import { boxes } from '@/storage/boxes';
import { debug } from '@/utils/debug';
import { query } from '@/utils/query';
import { Nodes } from '@/models/nodes';
import { Editor } from '@/editor';
import { createIframeBox } from '@/utils/create-iframe-box';
import { isFirefox, click } from '../utils';

const watchUrl = 'https://www.youtube.com/watch?v=5sMBhDv4sik';
const embedUrl = 'https://www.youtube.com/embed/5sMBhDv4sik';

const iframeBox = createIframeBox({
  type: 'inline',
  name: 'iframeBox',
  formDescription: 'Paste a link to embed a video from YouTube.',
  formLabel: 'URL',
  formPlaceholder: 'https://www.youtube.com/watch?v=...',
  formButtonText: 'Embed',
  deleteButtonText: 'Delete',
  validUrl: url => url.indexOf('https://www.youtube.com/') === 0,
  urlError: 'Invalid YouTube link',
  iframeAttributes: () => ({
    src: embedUrl,
  }),
  resize: true,
});

describe('utils / create-iframe-box', () => {

  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(() => {
    boxes.set('iframeBox', iframeBox);
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p>foo<focus />bar</p>',
    });
    editor.render();
  });

  afterEach(() => {
    boxes.delete('iframeBox');
    editor.unmount();
    rootNode.remove();
  });

  it('should embed an iframe', () => {
    const box = editor.selection.insertBox('iframeBox');
    const boxNode = box.node;
    boxNode.find('input[name="url"]').value(watchUrl);
    boxNode.find('button[name="embed"]').emit('click');
    expect(boxNode.find('iframe').length).to.equal(1);
  });

  it('should embed an iframe by pressing enter key', () => {
    const box = editor.selection.insertBox('iframeBox');
    const boxNode = box.node;
    boxNode.find('input[name="url"]').value(watchUrl);
    boxNode.find('input[name="url"]').emit('keydown', new KeyboardEvent('keydown', {
      key: 'Enter',
    }));
    expect(boxNode.find('iframe').length).to.equal(1);
  });

  it('should not embed an iframe that URL is invalid', () => {
    const box = editor.selection.insertBox('iframeBox');
    const boxNode = box.node;
    boxNode.find('input[name="url"]').value('invalid');
    boxNode.find('button[name="embed"]').emit('click');
    expect(boxNode.find('iframe').length).to.equal(0);
  });

  it('should remove box', () => {
    const box = editor.selection.insertBox('iframeBox', {
      url: watchUrl,
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

  it('should resize box', () => {
    const pointerId = isFirefox ? 0 : 1;
    const box = editor.selection.insertBox('iframeBox', {
      url: watchUrl,
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
