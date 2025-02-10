import { query } from 'lakelib/utils/query';
import { Nodes } from 'lakelib/models/nodes';
import { Box } from 'lakelib/models/box';
import { Editor } from 'lakelib/editor';
import { click } from '../../utils';

const mentionValue = {
  id: '1',
  name: 'luolonghao',
  nickname: 'Roddy',
  avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
};

describe('plugins / mention / mention-box', () => {

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
    box = editor.selection.insertBox('mention', mentionValue);
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
    click(boxContainer.find('.lake-mention'));
  });

  it('should re-render a box correctly', () => {
    box.render();
    box.render();
    const boxContainer = box.getContainer();
    expect(boxContainer.find('.lake-mention').length).to.equal(1);
  });

});
