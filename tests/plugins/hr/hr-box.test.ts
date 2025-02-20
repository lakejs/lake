import { query } from '@/utils/query';
import { Nodes } from '@/models/nodes';
import { Box } from '@/models/box';
import { Editor } from '@/editor';
import { click } from '../../utils';

describe('plugins/ hr / hr-box', () => {

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
    box = editor.selection.insertBox('hr');
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
    click(boxContainer.find('.lake-hr'));
  });

  it('should re-render a box correctly', () => {
    box.render();
    box.render();
    const boxContainer = box.getContainer();
    expect(boxContainer.find('.lake-hr').length).to.equal(1);
  });

});
