import { testPlugin } from '../utils';

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

});
