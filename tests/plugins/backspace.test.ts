import { testPlugin } from '../utils';

describe('backspace plugin', () => {

  it('merges paragraph into heading', () => {
    const content = `
    <h1>foo</h1>
    <p><focus />bar</p>
    `;
    const output = `
    <h1>foo<focus />bar</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

});
