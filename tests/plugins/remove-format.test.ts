import { testPlugin } from '../utils';

describe('plugin / remove-format', () => {

  it('should split the marks when no text was selected', () => {
    const content = `
    <p><i><u>f<focus />oo</u>bar</i></p>
    <p>bar</p>
    `;
    const output = `
    <p><i><u>f</u></i>\u200B<focus /><i><u>oo</u>bar</i></p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('removeFormat');
      },
    );
  });

  it('should remove the marks when the text was selected', () => {
    const content = `
    <p><i><u>f<anchor />oo</u>bar<focus /></i></p>
    <p>bar</p>
    `;
    const output = `
    <p><i><u>f</u></i><anchor />oobar<focus /></p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('removeFormat');
      },
    );
  });

});
