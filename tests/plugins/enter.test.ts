import { testPlugin } from '../utils';

describe('enter plugin', () => {

  it('paragraph: the focus is between the characters of the text', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>f</p>
    <p><focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('list: the focus is between the characters of the text', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>f</li></ul>
    <ul><li><focus />oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: the focus is at the beginning of the text', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <p><br /></p>
    <p><focus />foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: the focus is at the end of the text', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: should create a new block when there is no closest block', () => {
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

  it('heading: should become paragraph when the focus is at the end of the heading', () => {
    const content = `
    <h1>foo<focus /></h1>
    `;
    const output = `
    <h1>foo</h1>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('heading: should not become paragraph when the focus is at the beginning of the heading', () => {
    const content = `
    <h1><focus />foo</h1>
    `;
    const output = `
    <h1><br /></h1>
    <h1><focus />foo</h1>
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
