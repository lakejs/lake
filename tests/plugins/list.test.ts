import { testPlugin } from '../utils';

describe('list plugin', () => {

  it('should change a paragraph to a numbered list', () => {
    const content = `
    <p>numbered list<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <ol><li>numbered list<focus /></li></ol>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should change a numbered list to a paragraph', () => {
    const content = `
    <ol><li>numbered list<focus /></li></ol>
    <p>foo</p>
    `;
    const output = `
    <p>numbered list<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should change a paragraph to a bulleted list', () => {
    const content = `
    <p>bulleted list<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <ul><li>bulleted list<focus /></li></ul>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'bulleted');
      },
    );
  });

  it('should change a bulleted list to a paragraph', () => {
    const content = `
    <ul><li>bulleted list<focus /></li></ul>
    <p>foo</p>
    `;
    const output = `
    <p>bulleted list<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'bulleted');
      },
    );
  });

  it('should change a numbered list to a bulleted list', () => {
    const content = `
    <ol><li>foo<focus /></li></ol>
    <p>bar</p>
    `;
    const output = `
    <ul><li>foo<focus /></li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'bulleted');
      },
    );
  });

  it('should change a bulleted list to a numbered list', () => {
    const content = `
    <ul><li>foo<focus /></li></ul>
    <p>bar</p>
    `;
    const output = `
    <ol><li>foo<focus /></li></ol>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

});
