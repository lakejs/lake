import { testPlugin } from '../utils';

describe('enter plugin', () => {

  it('the focus is between the characters of the text', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>f</p><p><focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('Enter');
      },
    );
  });

  it('the focus is at the beginning of the text', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <p><br /></p><p><focus />foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('Enter');
      },
    );
  });

  it('the focus is at the end of the text', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p><p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('Enter');
      },
    );
  });

  it('no block', () => {
    const content = `
    foo<focus />bar
    `;
    const output = `
    <p>foo<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('Enter');
      },
    );
  });

});
