import { testPlugin } from '../utils';

describe('fontColor plugin', () => {

  it('should add a color to the selected text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: #ff0000;">two</span><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('fontColor', '#ff0000');
      },
    );
  });

  it('should remove color', () => {
    const content = `
    <p>one<anchor /><span style="color: red; font-size: 18px;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="font-size: 18px;">two</span><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commandexecute('fontColor', '');
      },
    );
  });

});
