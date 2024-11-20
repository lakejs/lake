import { boxes } from '../../src/storage/boxes';
import { query } from '../../src/utils/query';
import { getBox } from '../../src/utils/get-box';
import { Editor, Toolbar, Nodes } from '../../src';
import { insertLink } from '../../src/plugins/link';
import { click, testOperation } from '../utils';

const toolbarItems = [
  'bold',
  'link',
];

describe('plugins / link (functions)', () => {

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
  });

  it('insertLink: should remove br tag', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><a href="http://foo.com/">foo</a><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://foo.com/">foo</a>');
      },
    );
  });

  it('insertLink: should add a link after selecting text', () => {
    const content = `
    <p>f<anchor />oo<focus />bar</p>
    `;
    const output = `
    <p>f<anchor /><a href="http://foo.com/" target="_blank">oo</a><focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://foo.com/" target="_blank" />');
      },
    );
  });

  it('insertLink: should update url when the cursor is in the link', () => {
    const content = `
    <p>f<a href="http://foo.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    const output = `
    <p>f<a href="http://bar.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://bar.com/" target="_blank" />');
      },
    );
  });

  it('insertLink: should not update url with empty href', () => {
    const content = `
    <p>f<a href="http://foo.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    const output = `
    <p>f<a href="http://foo.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="">New link</a>');
      },
    );
  });

  it('insertLink: should add a link when selecting another link with text', () => {
    const content = `
    <p><anchor /><a href="http://foo.com/" target="_blank">foo</a>bar<focus /></p>
    `;
    const output = `
    <p><anchor /><a href="http://bar.com/" target="_blank">foobar</a><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://bar.com/" target="_blank" />');
      },
    );
  });

  it('insertLink: should add a link after selecting marks', () => {
    const content = `
    <p><anchor />one<strong>two</strong><u>three</u><i><s>four</s></i><focus /></p>
    `;
    const output = `
    <p><anchor /><a href="http://foo.com/" download="true">one<strong>two</strong><u>three</u><i><s>four</s></i></a><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://foo.com/" download="true" />');
      },
    );
  });

  it('insertLink: should add a link when the selection is astride a link', () => {
    const content = `
    <p><anchor />foo<a href="http://foo.com/">ba<focus />r</a></p>
    `;
    const output = `
    <p><anchor /><a href="http://bar.com/">fooba</a><focus /><a href="http://foo.com/">r</a></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://bar.com/" />');
      },
    );
  });

  it('insertLink: should add a link when the selection is astride a block', () => {
    const content = `
    <p><anchor /><i>foo</i></p>
    <p>one<strong>two</strong>three</p>
    <p>bar<focus /></p>
    `;
    const output = `
    <p><anchor /><a href="http://foo.com/"><i>foo</i></a></p>
    <p>one<strong>two</strong>three</p>
    <p>bar<focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://foo.com/" />');
      },
    );
  });

  it('insertLink: should not add a link after selecting content with box', () => {
    const content = `
    <p><focus />foo</p>
    <lake-box type="block" name="blockBox"></lake-box>
    <p><lake-box type="inline" name="inlineBox"></lake-box>bar</p>
    `;
    const output = `
    <p>foo</p>
    <anchor /><lake-box type="block" name="blockBox"></lake-box>
    <p><lake-box type="inline" name="inlineBox"></lake-box>bar<focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        const container = range.startNode.closestContainer();
        const boxNode = container.find('lake-box').eq(0);
        const box = getBox(boxNode);
        box.render();
        range.selectBoxStart(boxNode);
        range.setEnd(container.find('p').eq(1), 2);
        insertLink(range, '<a href="http://foo.com/" />');
      },
    );
  });

});

describe('plugins / link (main)', () => {

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
