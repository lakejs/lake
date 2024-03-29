import { testPlugin } from '../utils';

describe('plugins / block-quote', () => {

  it('no text is selected: sets a block', () => {
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
        editor.command.execute('blockQuote');
      },
    );
  });

  it('text is selected: sets a block', () => {
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
        editor.command.execute('blockQuote');
      },
    );
  });

  it('text is selected: sets multi-blockquote', () => {
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
        editor.command.execute('blockQuote');
      },
    );
  });

});
