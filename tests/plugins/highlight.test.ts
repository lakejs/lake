import { testPlugin } from '../utils';

describe('highlight plugin', () => {

  it('should add a background color to the selected text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="background-color: #ff0000;">two</span><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('highlight', '#ff0000');
      },
    );
  });

  it('should remove background color', () => {
    const content = `
    <p>one<anchor /><span style="background-color: red; font-size: 18px;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="font-size: 18px;">two</span><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('highlight', '');
      },
    );
  });

});
