import { testPlugin } from '../utils';

describe('plugin / undo', () => {

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
        editor.command.execute('bold');
        editor.command.execute('italic');
        editor.command.execute('undo');
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
        editor.command.execute('bold');
        editor.command.execute('italic');
        editor.keystroke.keydown('mod+z');
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
        editor.command.execute('selectAll');
        editor.command.execute('bold');
        editor.command.execute('undo');
        editor.command.execute('undo');
      },
    );
  });

});
