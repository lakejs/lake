import { click } from '../utils';
import { query } from '../../src/utils/query';
import { Editor, Toolbar, Nodes } from '../../src';

const toolbarItems = [
  'bold',
  'link',
];

describe('plugins / link', () => {

  let rootNode: Nodes;
  let editor: Editor;
  let toolbar: Toolbar;

  beforeEach(()=> {
    rootNode = query('<div class="lake-editor"><div class="lake-toolbar-root"></div><div class="lake-root"></div></div>');
    query(document.body).append(rootNode);
    const toolbarNode = rootNode.find('.lake-toolbar-root');
    toolbar = new Toolbar({
      root: toolbarNode,
      items: toolbarItems,
    });
    editor = new Editor({
      root: rootNode.find('.lake-root'),
      toolbar,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should insert new link', () => {
    editor.command.execute('link');
    expect(editor.popup.visible).to.equal(true);
    const value = editor.getValue();
    const linkTitle = editor.popup.container.find('input[name="title"]').value();
    expect(value).to.equal('<p><a>New link</a><focus /></p>');
    expect(linkTitle).to.equal('New link');
  });

  it('single editor: should update a link', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popup.visible).to.equal(true);
    editor.popup.container.find('input[name="url"]').value('http://bar.com');
    editor.popup.container.find('input[name="title"]').value('bar');
    click(editor.popup.container.find('button[name="save"]'));
    expect(editor.popup).to.equal(null);
    const value = editor.getValue();
    expect(value).to.equal('<p><a href="http://bar.com">bar</a><focus /></p>');
  });

  it('multi-editor: should update a link', () => {
    const rootNode2 = query('<div class="lake-root" />');
    query(document.body).append(rootNode2);
    const editor2 = new Editor({
      root: rootNode2,
    });
    editor2.render();
    editor2.setValue('<p><a href="">foo<focus /></a></p>');
    const linkNode = editor2.container.find('a');
    click(linkNode);
    expect(editor2.popup.visible).to.equal(true);
    editor2.popup.container.find('input[name="url"]').value('http://bar.com');
    editor2.popup.container.find('input[name="title"]').value('bar');
    click(editor2.popup.container.find('button[name="save"]'));
    expect(editor.popup).to.equal(null);
    expect(editor2.popup).to.equal(null);
    const value = editor2.getValue();
    expect(value).to.equal('<p><a href="http://bar.com">bar</a><focus /></p>');
    editor2.unmount();
    rootNode2.remove();
  });

  it('should remove a link', () => {
    editor.setValue('<p><a href="http://foo.com">foo</a>bar<focus /></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popup.visible).to.equal(true);
    click(editor.popup.container.find('button[name="unlink"]'));
    expect(editor.popup).to.equal(null);
    const value = editor.getValue();
    expect(value).to.equal('<p>foo<focus />bar</p>');
  });

  it('should close popup', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popup.visible).to.equal(true);
    click(editor.container);
    expect(editor.popup).to.equal(null);
  });

  it('should not close popup when clicking link popup', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popup.visible).to.equal(true);
    click(editor.popup.container);
    expect(editor.popup.visible).to.equal(true);
  });

  it('should not close popup when clicking link icon in the toolbar', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popup.visible).to.equal(true);
    click(toolbar.container.find('button[name="link"]'));
    expect(editor.popup.visible).to.equal(true);
  });

  it('should show popup when executing link command', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    click(toolbar.container.find('button[name="link"]'));
    expect(editor.popup.visible).to.equal(true);
    const linkUrl = editor.popup.container.find('input[name="url"]').value();
    const linkTitle = editor.popup.container.find('input[name="title"]').value();
    expect(linkUrl).to.equal('http://foo.com');
    expect(linkTitle).to.equal('foo');
  });

  it('should not show popup when the link node is outside the editor', () => {
    const linkNode = query('<a>foo<focus /></a>');
    query(document.body).append(linkNode);
    click(linkNode);
    expect(editor.popup).to.equal(null);
    linkNode.remove();
  });

});
