import { testBox, click } from '../utils';
import { query } from '../../src/utils';
import { Editor, Nodes, Box } from '../../src';

describe('boxes / code-block', () => {

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
    box = editor.insertBox('codeBlock', {
      lang: 'css',
      code: '.hello { }',
    });
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should activate box after clicking', done => {
    if (!box) {
      return;
    }
    const boxContainer = box.getContainer();
    box.getData('codeEditor').focus();
    editor.event.once('statechange', () => {
      expect(boxContainer.hasClass('lake-box-activated')).to.equal(true);
      done();
    });
  });

  it('should change language', done => {
    if (!box) {
      return;
    }
    const boxContainer = box.getContainer();
    const dropdownNode = boxContainer.find('.lake-dropdown');
    expect(box.value.lang).to.equal('css');
    expect(dropdownNode.computedCSS('display')).to.equal('none');
    box.getData('codeEditor').focus();
    editor.event.once('statechange', () => {
      if (!box) {
        return;
      }
      expect(dropdownNode.computedCSS('display')).to.equal('block');
      click(dropdownNode.find('button[name="langType"]'));
      expect(dropdownNode.find('.lake-dropdown-menu').computedCSS('display')).to.equal('block');
      click(dropdownNode.find('li[value="html"]'));
      expect(dropdownNode.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
      expect(box.value.lang).to.equal('html');
      done();
    });
  });

});

describe('ui: boxes / code-block', () => {

  it('box: codeBlock', () => {
    testBox('codeBlock', {
      lang: 'javascript',
      code: 'function foo() {\n\n}',
    }, box => {
      expect(box.name).to.equal('codeBlock');
    });
  });

});
