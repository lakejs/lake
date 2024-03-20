import { testPlugin } from '../utils';

describe('plugin / shift-enter-key', () => {

  it('the focus is between the characters of the text', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>f<br /><focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('shift+enter');
      },
    );
  });

  it('the focus is at the end of the text (1)', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo<br /><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('shift+enter');
      },
    );
  });

  it('the focus is at the end of the text (2)', () => {
    const content = `
    <p>foo<br /><br /><focus /></p>
    `;
    const output = `
    <p>foo<br /><br /><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('shift+enter');
      },
    );
  });

  it('box: the focus is at the beginning of the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="left"></lake-box>
    `;
    const output = `
    <p><br /></p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('shift+enter');
      },
    );
  });

  it('box: the focus is at the end of the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="right"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('shift+enter');
      },
    );
  });

  it('box: the focus is outside the end of the box', () => {
    const content = `
    <lake-box type="block" name="hr"></lake-box><focus />
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <p><br /><focus />foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('shift+enter');
      },
    );
  });

  it('box: the focus is at the center of the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <p><br /><focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('shift+enter');
      },
    );
  });

  it('box: the focus is in the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        editor.keystroke.keydown('shift+enter');
      },
    );
  });

});
