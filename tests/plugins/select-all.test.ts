import { testPlugin } from '../utils';

describe('selectAll plugin', () => {

  it('should select all contents', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <anchor /><p>onetwothree</p><focus />
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('selectAll');
      },
    );
  });

  it('keyboard shortcut', () => {
    const content = `
    <p>f<focus />oo</p>
    <p>bar</p>
    `;
    const output = `
    <anchor /><p>foo</p>
    <p>bar</p><focus />
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('mod+a');
      },
    );
  });

});
