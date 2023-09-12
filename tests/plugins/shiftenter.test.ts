import { testPlugin } from '../utils';

describe('shiftenter plugin', () => {

  it('the focus is between the characters of the text', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>f<br />\u200B<focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('Shift+Enter');
      },
    );
  });

  it('the focus is at the end of the text', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo<br />\u200B<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('Shift+Enter');
      },
    );
  });

});
