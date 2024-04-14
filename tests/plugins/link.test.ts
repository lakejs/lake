import { click } from '../utils';
import { query } from '../../src/utils';
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
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('block');
    const value = editor.getValue();
    const linkTitle = (editor.popupContainer.find('.lake-link-popup input[name="title"]').get(0) as HTMLInputElement).value;
    expect(value).to.equal('<p><a>New link</a><focus /></p>');
    expect(linkTitle).to.equal('New link');
  });

  it('should update a link', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('block');
    (editor.popupContainer.find('.lake-link-popup input[name="url"]').get(0) as HTMLInputElement).value = 'http://bar.com';
    (editor.popupContainer.find('.lake-link-popup input[name="title"]').get(0) as HTMLInputElement).value = 'bar';
    click(editor.popupContainer.find('.lake-link-popup button[name="save"]'));
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('none');
    const value = editor.getValue();
    expect(value).to.equal('<p><a href="http://bar.com">bar</a><focus /></p>');
  });

  it('should remove a link', () => {
    editor.setValue('<p><a href="http://foo.com">foo</a>bar<focus /></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('block');
    click(editor.popupContainer.find('.lake-link-popup button[name="unlink"]'));
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('none');
    const value = editor.getValue();
    expect(value).to.equal('<p>foo<focus />bar</p>');
  });

  it('should close popup', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('block');
    click(editor.container);
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('none');
  });

  it('should not close popup when clicking link popup', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('block');
    click(editor.popupContainer.find('.lake-link-popup'));
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('block');
  });

  it('should not close popup when clicking link icon in the toolbar', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    const linkNode = editor.container.find('a');
    click(linkNode);
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('block');
    click(toolbar.container.find('button[name="link"]'));
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('block');
  });

  it('should show popup when executing link command', () => {
    editor.setValue('<p><a href="http://foo.com">foo<focus /></a></p>');
    click(toolbar.container.find('button[name="link"]'));
    expect(editor.popupContainer.find('.lake-link-popup').computedCSS('display')).to.equal('block');
    const linkUrl = (editor.popupContainer.find('.lake-link-popup input[name="url"]').get(0) as HTMLInputElement).value;
    const linkTitle = (editor.popupContainer.find('.lake-link-popup input[name="title"]').get(0) as HTMLInputElement).value;
    expect(linkUrl).to.equal('http://foo.com');
    expect(linkTitle).to.equal('foo');
  });

  it('should not show popup when the link node is outside the editor', () => {
    const linkNode = query('<a>foo<focus /></a>');
    query(document.body).append(linkNode);
    click(linkNode);
    expect(editor.popupContainer.find('.lake-link-popup').length).to.equal(0);
    linkNode.remove();
  });

});
