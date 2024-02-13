import { testPlugin } from '../utils';

describe('plugin / indent', () => {

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
    <ul indent="1"><li><anchor />foo<focus /></li></ul>
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

  it('list: increases indent twice', () => {
    const content = `
    <ul><li><anchor />foo<focus /></li></ul>
    <p>bar</p>
    `;
    const output = `
    <ul indent="2"><li><anchor />foo<focus /></li></ul>
    <p>bar</p>
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

  it('list: indent limit', () => {
    const content = `
    <ul indent="10"><li><anchor />foo<focus /></li></ul>
    <p>bar</p>
    `;
    const output = `
    <ul indent="10"><li><anchor />foo<focus /></li></ul>
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

  it('list: decreases indent once', () => {
    const content = `
    <ul indent="1"><li><anchor />foo<focus /></li></ul>
    <p>bar</p>
    `;
    const output = `
    <ul><li><anchor />foo<focus /></li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('indent', 'decrease');
      },
    );
  });

  it('list: decreases indent twice', () => {
    const content = `
    <ul indent="2"><li><anchor />foo<focus /></li></ul>
    <p>bar</p>
    `;
    const output = `
    <ul><li><anchor />foo<focus /></li></ul>
    <p>bar</p>
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

  it('list: should adjust start attributes when indent first item', () => {
    const content = `
    <p>one</p>
    <ol start="1"><li><focus />two</li></ol>
    <ol start="2"><li>three</li></ol>
    <ol start="3"><li>four</li></ol>
    <p>five</p>
    `;
    const output = `
    <p>one</p>
    <ol start="1" indent="1"><li><focus />two</li></ol>
    <ol start="1"><li>three</li></ol>
    <ol start="2"><li>four</li></ol>
    <p>five</p>
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
