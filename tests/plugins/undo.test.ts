import { testPlugin } from '../utils';

describe('undo plugin', () => {

  it('undoes the last executed command', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><strong>two</strong><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
        editor.commands.execute('italic');
        editor.commands.execute('undo');
      },
    );
  });

  it('keyboard shortcut', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><strong>two</strong><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
        editor.commands.execute('italic');
        editor.keystroke.keydown('$mod+KeyZ');
      },
    );
  });

  it('undoes selectAll command', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor />two<focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('selectAll');
        editor.commands.execute('bold');
        editor.commands.execute('undo');
        editor.commands.execute('undo');
      },
    );
  });

});
