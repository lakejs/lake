import { click } from '../utils';
import { query } from '../../src/utils';
import { Editor, Nodes } from '../../src';

describe('plugins / link', () => {

  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(()=> {
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('should insert new link', () => {
    editor.command.execute('link');
    const value = editor.getValue();
    const linkTitle = (editor.popupContainer.find('.lake-link-popup input[name="title"]').get(0) as HTMLInputElement).value;
    editor.unmount();
    expect(value).to.equal('<p><a>New link</a><focus /></p>');
    expect(linkTitle).to.equal('New link');
  });

  it('should update a link', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    editor.command.execute('link');
    (editor.popupContainer.find('.lake-link-popup input[name="url"]').get(0) as HTMLInputElement).value = 'http://bar.com';
    (editor.popupContainer.find('.lake-link-popup input[name="title"]').get(0) as HTMLInputElement).value = 'bar';
    click(editor.popupContainer.find('.lake-link-popup .lake-button-save'));
    const value = editor.getValue();
    editor.unmount();
    expect(value).to.equal('<p><a href="http://bar.com"><focus />bar</a></p>');
  });

  it('should remove a link', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    editor.command.execute('link');
    click(editor.popupContainer.find('.lake-link-popup .lake-button-unlink'));
    const value = editor.getValue();
    editor.unmount();
    expect(value).to.equal('<p>foo<focus /></p>');
  });

  it('should copy a link to clipboard', async() => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    editor.command.execute('link');
    click(editor.popupContainer.find('.lake-link-popup .lake-button-copy'));
    editor.unmount();
    expect(editor.popupContainer.find('.lake-link-popup .lake-button-copy svg').eq(0).computedCSS('display')).to.equal('none');
    expect(editor.popupContainer.find('.lake-link-popup .lake-button-copy svg').eq(1).computedCSS('display')).to.equal('inline');
  });

});
