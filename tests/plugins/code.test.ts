import { testPlugin } from '../utils';

describe('plugin / code', () => {

  it('should add a code to the selected text', () => {
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
        editor.command.execute('code');
      },
    );
  });

});
