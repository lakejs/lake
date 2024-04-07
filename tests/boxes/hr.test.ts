import { testBox, click } from '../utils';
import { query } from '../../src/utils';
import { Editor, Nodes, Box } from '../../src';

describe('boxes / hr', () => {

  let rootNode: Nodes;
  let editor: Editor;
  let box: Box | null;

  beforeEach(()=> {
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    box = editor.insertBox('hr');
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should focus on box after clicking', done => {
    if (!box) {
      return;
    }
    const boxContainer = box.getContainer();
    click(boxContainer.find('.lake-hr'));
    editor.event.once('statechange', () => {
      expect(boxContainer.hasClass('lake-box-focused')).to.equal(true);
      done();
    });
  });

});

describe('ui: boxes / hr', () => {

  it('box: hr', () => {
    testBox('hr', undefined, box => {
      expect(box.name).to.equal('hr');
    });
  });

});
