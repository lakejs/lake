import { testPlugin } from '../utils';

describe('indent plugin', () => {

  it('paragraph: increases indent once', () => {
    const content = `
    <p><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <p style="margin-left: 40px;"><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('indent', 'increase');
      },
    );
  });

  it('paragraph: increases indent twice', () => {
    const content = `
    <p><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <p style="margin-left: 80px;"><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('indent', 'increase');
        editor.command.execute('indent', 'increase');
      },
    );
  });

  it('paragraph: decreases indent once', () => {
    const content = `
    <p style="text-indent: 2em; margin-left: 40px;"><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <p style="text-indent: 2em;"><anchor />heading<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('indent', 'decrease');
      },
    );
  });

  it('paragraph: decreases indent twice', () => {
    const content = `
    <p style="margin-left: 80px;"><anchor />heading<focus /></p>
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
        editor.command.execute('indent', 'decrease');
        editor.command.execute('indent', 'decrease');
      },
    );
  });

  it('paragraph: decreases text indent', () => {
    const content = `
    <p style="text-indent: 2em;"><anchor />heading<focus /></p>
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
        editor.command.execute('indent', 'decrease');
      },
    );
  });

  it('list: increases indent once', () => {
    const content = `
    <ul><li><anchor />foo<focus /></li></ul>
    <p>bar</p>
    `;
    const output = `
    <ul style="margin-left: 40px;"><li><anchor />foo<focus /></li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('indent', 'increase');
      },
    );
  });

});
