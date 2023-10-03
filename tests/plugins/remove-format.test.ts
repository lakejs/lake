import { testPlugin } from '../utils';

describe('removeFormat plugin', () => {

  it('should split the marks when no text was selected', () => {
    const content = `
    <p><i><u>f<focus />oo</u>bar</i></p>
    <p>bar</p>
    `;
    const output = `
    <p><i><u>f</u></i>\u200B<focus /><i><u>oo</u>oo</i></p>
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
