import { testPlugin } from '../utils';

describe('plugins / block-quote', () => {

  it('no text selected: should set a blockquote', () => {
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

  it('text selected: should set a blockquote', () => {
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

  it('text selected: should set multi-blockquote', () => {
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

  it('should set an info blockquote', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <blockquote type="info">foo<focus /></blockquote>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('blockQuote', 'info');
      },
    );
  });

  it('should set a tip blockquote', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <blockquote type="tip">foo<focus /></blockquote>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('blockQuote', 'tip');
      },
    );
  });

  it('should set a warning blockquote', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <blockquote type="warning">foo<focus /></blockquote>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('blockQuote', 'warning');
      },
    );
  });

  it('should set a danger blockquote', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <blockquote type="danger">foo<focus /></blockquote>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('blockQuote', 'danger');
      },
    );
  });

  it('should set a normal blockquote when given invalid type', () => {
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
        editor.command.execute('blockQuote', 'invalid');
      },
    );
  });

});
