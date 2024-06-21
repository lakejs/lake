import { testPlugin } from '../utils';

describe('plugins / specialCharacter', () => {

  it('should insert a special character', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo😃<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('specialCharacter', '😃');
      },
    );
  });

});
