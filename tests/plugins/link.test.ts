import { click } from '../utils';
import { query } from '../../src/utils';
import { Editor, Nodes } from '../../src';

describe('plugin / link', () => {

  let targetNode: Nodes;
  let editor: Editor;

  beforeEach(()=> {
    targetNode = query('<div class="lake-main" />');
    query(document.body).append(targetNode);
    editor = new Editor({
      root: targetNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
  });

  afterEach(() => {
    // targetNode.remove();
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

});
