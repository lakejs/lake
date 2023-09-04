import { testPlugin } from '../utils';

describe('blockquote plugin', () => {

  it('cursor state: to set a block', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <blockquote>foo<focus /></blockquote>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('blockquote');
      },
    );
  });

  it('selecting state: to set a block', () => {
    const content = `
    <p><anchor />foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <blockquote><anchor />foo<focus /></blockquote>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('blockquote');
      },
    );
  });

  it('selecting state: to set multi-blockquote', () => {
    const content = `
    <p><anchor />foo</p>
    <p>bar<focus /></p>
    <p>paragraph</p>
    `;
    const output = `
    <blockquote><anchor />foo</blockquote>
    <blockquote>bar<focus /></blockquote>
    <p>paragraph</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('blockquote');
      },
    );
  });

});
