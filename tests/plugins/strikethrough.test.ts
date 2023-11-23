import { testPlugin } from '../utils';

describe('plugin / strikethrough', () => {

  it('should get correct result after executing bold and strikethrough', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><s><strong>two</strong></s><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('bold');
        editor.command.execute('strikethrough');
      },
    );
  });

  it('keyboard shortcut', () => {
    const content = `
    <p>f<focus />oo</p>
    <p>bar</p>
    `;
    const output = `
    <p>f<s>\u200B<focus /></s>oo</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('mod+shift+x');
      },
    );
  });

});
