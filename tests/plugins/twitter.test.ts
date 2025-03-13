import { testPlugin } from '../utils';

describe('plugins / twitter', () => {

  it('should insert a form', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="twitter" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('twitter');
      },
    );
  });

});
