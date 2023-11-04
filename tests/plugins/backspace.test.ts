import { testPlugin } from '../utils';

describe('backspace plugin', () => {

  it('no content', () => {
    const content = `
    <focus />
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });


  it('sets heading to paragraph', () => {
    const content = `
    <h1><br /><focus /></h1>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('merges empty paragraphs', () => {
    const content = `
    <p><br /></p>
    <p><br /><focus /></p>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('merges paragraph into heading', () => {
    const content = `
    <h1>foo</h1>
    <p><focus />bar</p>
    `;
    const output = `
    <h1>foo<focus />bar</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('merges empty paragraph into heading', () => {
    const content = `
    <h1>foo</h1>
    <p><br /><focus /></p>
    `;
    const output = `
    <h1>foo<focus /></h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

});
