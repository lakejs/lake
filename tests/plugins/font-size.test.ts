import { testPlugin } from '../utils';

describe('fontSize plugin', () => {

  it('should add a font size to the selected text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="font-size: 18px;">two</span><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('fontSize', '18px');
      },
    );
  });

  it('should remove font size', () => {
    const content = `
    <p>one<anchor /><span style="color: red; font-size: 18px;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red;">two</span><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('fontSize', '');
      },
    );
  });

});
