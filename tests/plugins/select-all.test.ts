import { testPlugin } from '../utils';

describe('plugins / select-all', () => {

  it('should select all contents', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p><anchor />onetwothree<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('selectAll');
      },
    );
  });

});
