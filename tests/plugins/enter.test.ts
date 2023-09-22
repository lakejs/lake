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
        editor.keystroke.keydown('enter');
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
        editor.keystroke.keydown('enter');
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
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('should create a new block when there is no closest block', () => {
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
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('should become paragraph when the focus is at the end of the heading', () => {
    const content = `
    <h1>foo<focus /></h1>
    `;
    const output = `
    <h1>foo</h1><p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('should not become paragraph when the focus is at the beginning of the heading', () => {
    const content = `
    <h1><focus />foo</h1>
    `;
    const output = `
    <h1><br /></h1><h1><focus />foo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

});
