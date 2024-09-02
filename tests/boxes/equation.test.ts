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

  it('should update current expression', () => {
    const boxContainer = box.getContainer();
    click(boxContainer.find('.lake-equation-view'));
    const event = new InputEvent('input', {
      data: 'x^2',
      inputType: 'insertText',
      isComposing: false,
    });
    boxContainer.find('textarea').value('x^2');
    boxContainer.find('textarea').emit('input', event);
    expect(box.value.code).to.equal('x^2');
  });

  it('should save current expression', () => {
    const boxContainer = box.getContainer();
    click(boxContainer.find('.lake-equation-view'));
    const event = new InputEvent('input', {
      data: 'x^2',
      inputType: 'insertText',
      isComposing: false,
    });
    boxContainer.find('textarea').value('x^2');
    boxContainer.find('textarea').emit('input', event);
    click(boxContainer.find('button[name="save"]'));
    expect(box.value.code).to.equal('x^2');
    expect(boxContainer.find('.lake-equation-form').computedCSS('display')).to.equal('none');
  });

  it('should hide the textarea', () => {
    const boxContainer = box.getContainer();
    const boxNode = box.node;
    click(boxContainer.find('.lake-equation-view'));
    editor.selection.range.selectBoxEnd(boxNode);
    expect(boxContainer.find('.lake-equation-form').computedCSS('display')).to.equal('none');
  });

  it('should re-render a box correctly', () => {
    box.render();
    box.render();
    const boxContainer = box.getContainer();
    expect(boxContainer.find('.lake-equation').length).to.equal(1);
  });

});
