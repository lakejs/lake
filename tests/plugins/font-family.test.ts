import { testPlugin } from '../utils';

describe('fontFamily plugin', () => {

  it('should add a font to the selected text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="font-family: Tahoma;">two</span><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('fontFamily', 'Tahoma');
      },
    );
  });

  it('should update font after executing another fontFamily command', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="font-family: Verdana;">two</span><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('fontFamily', 'Tahoma');
        editor.commands.execute('fontFamily', 'Verdana');
      },
    );
  });

  it('should remove font', () => {
    const content = `
    <p>one<anchor /><span style="color: red; font-family: Verdana;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red;">two</span><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('fontFamily', '');
      },
    );
  });

});