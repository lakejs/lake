import type { Editor } from '../../src';
import { testPlugin, click } from '../utils';

function testFormatPainter(editor: Editor): void {
  editor.command.execute('formatPainter');
  expect(editor.container.hasClass('lake-format-painter')).to.equal(true);
  editor.selection.range.selectNodeContents(editor.container.find('p').eq(1));
  click(editor.container);
  expect(editor.container.hasClass('lake-format-painter')).to.equal(false);
}

describe('plugins / format-painter', () => {

  it('should copy and add strong with collapsed selection', () => {
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

  it('should copy and add strong with expanded selection', () => {
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

});
