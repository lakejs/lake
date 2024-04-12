import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / tab-key', () => {

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

  it('inline box: the focus is on the start', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box>bar</p>
    `;
    const output = `
    <p style="text-indent: 2em;">foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box>bar</p>
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

  it('inline box: the focus is on the end', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box>bar</p>
    `;
    const output = `
    <p style="text-indent: 2em;">foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('tab');
      },
    );
  });

  it('block box: the focus i', () => {
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

  it('block box: the focus is on the end', () => {
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
        editor.keystroke.keydown('tab');
      },
    );
  });

});
