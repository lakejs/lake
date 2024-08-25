import { testPlugin } from '../utils';

describe('plugins / escape-key', () => {

  it('should lose focus', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.focus();
        expect(editor.hasFocus).to.equal(true);
        editor.keystroke.keydown('escape');
        expect(editor.hasFocus).to.equal(false);
      },
    );
  });

  it('focus is on the beginning of a box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
    <p>bar</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('escape');
      },
    );
  });

  it('focus is on the box center', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('escape');
      },
    );
  });

  it('focus is on the end of a box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>bar</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('escape');
      },
    );
  });

  it('focus is in the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        editor.keystroke.keydown('escape');
      },
    );
  });

});
