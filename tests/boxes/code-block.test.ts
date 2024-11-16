import { click } from '../utils';
import { query } from '../../src/utils/query';
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
    box = editor.selection.insertBox('codeBlock', {
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
    box.event.once('focus', () => {
      expect(boxContainer.hasClass('lake-box-focused')).to.equal(true);
      expect(boxContainer.find('.lake-dropdown').computedCSS('display')).to.equal('block');
      done();
    });
    editor.selection.selectBox(box);
  });

  it('should activate box after clicking', done => {
    const boxContainer = box.getContainer();
    box.event.once('focus', () => {
      expect(boxContainer.hasClass('lake-box-activated')).to.equal(true);
      expect(boxContainer.find('.lake-dropdown').computedCSS('display')).to.equal('block');
      done();
    });
    click(boxContainer.find('.lake-code-block'));
  });

  it('should change language', done => {
    const boxContainer = box.getContainer();
    const dropdownNode = boxContainer.find('.lake-dropdown');
    expect(box.value.lang).to.equal('css');
    expect(dropdownNode.computedCSS('display')).to.equal('none');
    box.event.once('focus', () => {
      expect(dropdownNode.computedCSS('display')).to.equal('block');
      click(dropdownNode.find('button[name="langType"]'));
      const menuNode = query(document.body).find('.lake-dropdown-menu').reverse().eq(0);
      expect(menuNode.computedCSS('display')).to.equal('block');
      click(menuNode.find('li[value="html"]'));
      expect(menuNode.computedCSS('display')).to.equal('none');
      expect(box.value.lang).to.equal('html');
      done();
    });
    click(boxContainer.find('.lake-code-block'));
  });

  it('error status: should focus on box after clicking', done => {
    const CodeMirror = window.LakeCodeMirror;
    window.LakeCodeMirror = undefined;
    box = editor.selection.insertBox('codeBlock', {
      lang: 'css',
      code: '.hello { }',
    });
    const boxContainer = box.getContainer();
    click(boxContainer.find('.lake-code-block'));
    box.event.once('focus', () => {
      expect(boxContainer.hasClass('lake-box-focused')).to.equal(true);
      window.LakeCodeMirror = CodeMirror;
      done();
    });
  });

});
