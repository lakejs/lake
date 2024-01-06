import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuL2RhdGEvY293LmpwZyJ9';

describe('plugin / tab-key', () => {

  it('paragraph: should add text indent', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <p style="text-indent: 2em;">foo<focus /></p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

  it('paragraph: should add indent', () => {
    const content = `
    <p style="text-indent: 2em;">foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <p style="text-indent: 2em; margin-left: 40px;">foo<focus /></p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

  it('heading: should not add text indent', () => {
    const content = `
    <h1>foo<focus /></h1>
    <p>bar</p>
    `;
    const output = `
    <h1 style="margin-left: 40px;">foo<focus /></h1>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

  it('inline box: the focus is left', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    const output = `
    <p style="text-indent: 2em;">foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

  it('inline box: the focus is center', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p style="text-indent: 2em;">foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

  it('inline box: the focus is right', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    const output = `
    <p style="text-indent: 2em;">foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

  it('block box: the focus is left', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    <p>bar</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

  it('block box: the focus is center', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bar</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

  it('block box: the focus is right', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p>bar</p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

});
