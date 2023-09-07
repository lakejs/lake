import { testPlugin } from '../utils';

describe('strikethrough plugin', () => {

  it('should get correct result after executing bold and strikethrough', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><s><strong>two</strong></s><focus />three</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
        editor.commands.execute('strikethrough');
      },
    );
  });

});
