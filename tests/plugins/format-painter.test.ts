import { Editor, Utils } from '../../src';
import { testPlugin, click, formatHTML } from '../utils';

const { query, debug } = Utils;

function testFormatPainter(editor: Editor): void {
  editor.command.execute('formatPainter');
  expect(editor.container.hasClass('lake-format-painter')).to.equal(true);
  editor.selection.range.selectNodeContents(editor.container.find('p').eq(1));
  click(editor.container);
  expect(editor.container.hasClass('lake-format-painter')).to.equal(false);
}

describe('plugins / format-painter', () => {

  it('should copy and add strong when selection is collapsed', () => {
    const content = `
    <p><strong>f<focus />oo</strong></p>
    <p>bar</p>
    `;
    const output = `
    <p><strong>foo</strong></p>
    <p><anchor /><strong>bar</strong><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        testFormatPainter(editor);
      },
    );
  });

  it('should copy and add strong when selection is expanded', () => {
    const content = `
    <p><anchor /><strong>foo</strong><focus /></p>
    <p>bar</p>
    `;
    const output = `
    <p><strong>foo</strong></p>
    <p><anchor /><strong>bar</strong><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        testFormatPainter(editor);
      },
    );
  });

  it('should copy and add strong-i', () => {
    const content = `
    <p><strong><i><anchor />foo<focus /></i></strong></p>
    <p>bar</p>
    `;
    const output = `
    <p><strong><i>foo</i></strong></p>
    <p><anchor /><strong><i>bar</i></strong><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        testFormatPainter(editor);
      },
    );
  });

  it('should copy and add span-i', () => {
    const content = `
    <p><span style="color: red; background-color: blue;"><i><anchor />foo<focus /></i></span></p>
    <p>bar</p>
    `;
    const output = `
    <p><span style="color: red; background-color: blue;"><i>foo</i></span></p>
    <p><anchor /><span style="color: red; background-color: blue;"><i>bar</i></span><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        testFormatPainter(editor);
      },
    );
  });

  it('should not copy link', () => {
    const content = `
    <p><a href="url">f<focus />oo</a></p>
    <p>bar</p>
    `;
    const output = `
    <p><a href="url">foo</a></p>
    <p><anchor />bar<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        testFormatPainter(editor);
      },
    );
  });

  it('should cancel painting', () => {
    const content = `
    <p><strong>f<focus />oo</strong></p>
    <p>bar</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('formatPainter');
        click(editor.container.parent());
        expect(editor.container.hasClass('lake-format-painter')).to.equal(false);
      },
    );
  });

  it('should not apply style to another editor', () => {
    const content = `
    <p><strong>f<focus />oo</strong></p>
    <p>bar</p>
    `;
    const output = `
    <p><strong>foo</strong></p>
    <p><anchor />bar<focus /></p>
    `;
    const rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
    const rootNode2 = query('<div class="lake-root" />');
    query(document.body).append(rootNode2);
    const editor = new Editor({
      root: rootNode,
      value: content,
    });
    editor.render();
    const editor2 = new Editor({
      root: rootNode2,
      value: content,
    });
    editor2.render();
    editor.command.execute('formatPainter');
    expect(editor.container.hasClass('lake-format-painter')).to.equal(true);
    editor2.selection.range.selectNodeContents(editor2.container.find('p').eq(1));
    click(editor2.container.find('p').eq(1));
    expect(editor.container.hasClass('lake-format-painter')).to.equal(false);
    const html = editor2.getValue();
    editor.unmount();
    editor2.unmount();
    rootNode.remove();
    rootNode2.remove();
    debug(`output: ${html}`);
    expect(html).to.equal(formatHTML(output));
  });

});
