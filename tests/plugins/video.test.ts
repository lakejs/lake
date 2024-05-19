import { testPlugin } from '../utils';

describe('plugins / video', () => {

  it('should insert a form', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="video" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('video');
      },
    );
  });

});
