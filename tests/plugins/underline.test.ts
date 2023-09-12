import { testPlugin } from '../utils';

describe('underline plugin', () => {

  it('should get correct result after executing bold and underline', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><u><strong>two</strong></u><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
        editor.commands.execute('underline');
      },
    );
  });

  it('keyboard shortcut', () => {
    const content = `
    <p>f<focus />oo</p>
    <p>bar</p>
    `;
    const output = `
    <p>f<u>\u200B<focus /></u>oo</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('$mod+KeyU');
      },
    );
  });

});
