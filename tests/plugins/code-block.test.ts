import { testPlugin } from '../utils';

describe('plugins / code-block', () => {

  it('inserts into the end of the paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="codeBlock" focus="right"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('codeBlock');
      },
    );
  });

});
