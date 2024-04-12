import { click } from '../utils';
import { query } from '../../src/utils';
import { Editor, Nodes, Box } from '../../src';

describe('boxes / code-block', () => {

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
    box = editor.insertBox('codeBlock', {
      lang: 'css',
      code: '.hello { }',
    });
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should focus on box after selecting box', done => {
    const boxContainer = box.getContainer();
    editor.selection.range.selectBox(box.node);
    editor.event.once('boxselectionstylechange', () => {
      expect(boxContainer.hasClass('lake-box-focused')).to.equal(true);
      expect(boxContainer.find('.lake-dropdown').computedCSS('display')).to.equal('block');
      done();
    });
  });

  it('should activate box after clicking', done => {
    const boxContainer = box.getContainer();
    box.getData('codeEditor').focus();
    editor.event.once('boxselectionstylechange', () => {
      expect(boxContainer.hasClass('lake-box-activated')).to.equal(true);
      expect(boxContainer.find('.lake-dropdown').computedCSS('display')).to.equal('block');
      done();
    });
  });

  it('should change language', done => {
    const boxContainer = box.getContainer();
    const dropdownNode = boxContainer.find('.lake-dropdown');
    expect(box.value.lang).to.equal('css');
    expect(dropdownNode.computedCSS('display')).to.equal('none');
    box.getData('codeEditor').focus();
    editor.event.once('boxselectionstylechange', () => {
      expect(dropdownNode.computedCSS('display')).to.equal('block');
      click(dropdownNode.find('button[name="langType"]'));
      expect(dropdownNode.find('.lake-dropdown-menu').computedCSS('display')).to.equal('block');
      click(dropdownNode.find('li[value="html"]'));
      expect(dropdownNode.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
      expect(box.value.lang).to.equal('html');
      done();
    });
  });

  it('error status: should focus on box after clicking', done => {
    const CodeMirror = window.CodeMirror;
    window.CodeMirror = undefined;
    box = editor.insertBox('codeBlock', {
      lang: 'css',
      code: '.hello { }',
    });
    const boxContainer = box.getContainer();
    click(boxContainer.find('.lake-code-block'));
    editor.event.once('boxselectionstylechange', () => {
      expect(boxContainer.hasClass('lake-box-focused')).to.equal(true);
      window.CodeMirror = CodeMirror;
      done();
    });
  });

});
