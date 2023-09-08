import { testPlugin } from '../utils';

describe('code plugin', () => {

  it('should add code to the selected text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><code>two</code><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('code');
      },
    );
  });

});
