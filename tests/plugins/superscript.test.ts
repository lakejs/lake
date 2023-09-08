import { testPlugin } from '../utils';

describe('superscript plugin', () => {

  it('should add sup to the selected text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><sup>two</sup><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('superscript');
      },
    );
  });

});
