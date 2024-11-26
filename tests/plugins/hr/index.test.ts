import { testPlugin } from '../../utils';

describe('plugins / hr / index', () => {

  it('inserts into the end of the paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('hr');
      },
    );
  });

});
