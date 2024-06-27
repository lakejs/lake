import { click } from '../utils';
import { query } from '../../src/utils';
import { Editor, Nodes, Box } from '../../src';

const code = String.raw`c = \pm\sqrt{a^2 + b^2}`;

describe('boxes / equation', () => {

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
    box = editor.selection.insertBox('equation', {
      code,
    });
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
    click(boxContainer.find('.lake-equation-view'));
  });

  it('should re-render a box correctly', () => {
    box.render();
    box.render();
    const boxContainer = box.getContainer();
    expect(boxContainer.find('.lake-equation').length).to.equal(1);
  });

});
