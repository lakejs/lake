import { testPlugin } from '../utils';

describe('subscript plugin', () => {

  it('should add a sub to the selected text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><sub>two</sub><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('subscript');
      },
    );
  });

});
