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

  it('should remove selected content', () => {
    const content = `
    <p><anchor />foo<focus />bar</p>
    `;
    const output = `
    <p>😃<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('specialCharacter', '😃');
      },
    );
  });

  it('should remove br', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p>😃<focus /></p>
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
