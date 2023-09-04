import { testPlugin } from '../utils';

describe('heading plugin', () => {

  it('cursor state: to set a heading', () => {
    const content = `
    <p>heading<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <h1>heading<focus /></h1>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('heading', 'h1');
      },
    );
  });

  it('selecting state: to set a heading', () => {
    const content = `
    <p><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <h2><anchor />heading<focus /></h2>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('heading', 'h2');
      },
    );
  });

  it('selecting state: to set a paragraph', () => {
    const content = `
    <h2><anchor />heading<focus /></h2>
    <p>foo</p>
    `;
    const output = `
    <p><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('heading', 'p');
      },
    );
  });

  it('selecting state: to set multi-heading', () => {
    const content = `
    <p><anchor />foo</p>
    <p>bar<focus /></p>
    <p>paragraph</p>
    `;
    const output = `
    <h3><anchor />foo</h3>
    <h3>bar<focus /></h3>
    <p>paragraph</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('heading', 'h3');
      },
    );
  });

});
