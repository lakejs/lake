import { testPlugin } from '../utils';

describe('tab plugin', () => {

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

});
