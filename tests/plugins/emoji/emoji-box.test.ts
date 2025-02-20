import { query } from '@/utils/query';
import { Nodes } from '@/models/nodes';
import { Box } from '@/models/box';
import { Editor } from '@/editor';
import { click } from '../../utils';

const emojiValue = {
  url: '../assets/emojis/face_blowing_a_kiss_color.svg',
  title: 'Face blowing a kiss',
};

describe('plugins / emoji / emoji-box', () => {

  let rootNode: Nodes;
  let editor: Editor;
  let box: Box;

  beforeEach(() => {
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    box = editor.selection.insertBox('emoji', emojiValue);
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should focus on box after clicking', done => {
    const boxContainer = box.getContainer();
    box.event.once('focus', () => {
      expect(boxContainer.hasClass('lake-box-focused')).to.equal(true);
      done();
    });
    click(boxContainer.find('.lake-emoji'));
  });

  it('should re-render a box correctly', () => {
    box.render();
    box.render();
    const boxContainer = box.getContainer();
    expect(boxContainer.find('.lake-emoji').length).to.equal(1);
  });

});
