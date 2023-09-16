import { testPlugin } from '../utils';

describe('redo plugin', () => {

  it('redoes the previous undo command', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><i><strong>two</strong></i><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
        editor.commands.execute('italic');
        editor.commands.execute('undo');
        editor.commands.execute('redo');
      },
    );
  });

  it('keyboard shortcut', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><i><strong>two</strong></i><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
        editor.commands.execute('italic');
        editor.commands.execute('undo');
        editor.keystroke.keydown('$mod+KeyY');
      },
    );
  });

});
