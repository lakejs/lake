import { testPlugin } from '../utils';

describe('selectAll plugin', () => {

  it('should select all contents', () => {
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
        editor.commands.execute('selectAll');
      },
    );
  });

});
