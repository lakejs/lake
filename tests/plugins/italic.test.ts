import { testPlugin } from '../utils';

describe('italic plugin', () => {

  it('should get correct result after executing bold and italic', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><strong><i>two</i></strong><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('italic');
        editor.commands.execute('bold');
      },
    );
  });

  it('keyboard shortcut', () => {
    const content = `
    <p>f<focus />oo</p>
    <p>bar</p>
    `;
    const output = `
    <p>f<i>\u200B<focus /></i>oo</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('mod+i');
      },
    );
  });

});
