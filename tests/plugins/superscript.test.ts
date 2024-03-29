import { testPlugin } from '../utils';

describe('plugins / superscript', () => {

  it('should add a sup to the selected text', () => {
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
        editor.command.execute('superscript');
      },
    );
  });

});
