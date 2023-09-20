import { testPlugin } from '../utils';

describe('indent plugin', () => {

  it('increases indent once', () => {
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
        editor.commands.execute('indent', 'increase');
      },
    );
  });

  it('increases indent twice', () => {
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
        editor.commands.execute('indent', 'increase');
        editor.commands.execute('indent', 'increase');
      },
    );
  });

  it('decreases indent once', () => {
    const content = `
    <p style="margin-left: 40px;"><anchor />heading<focus /></p>
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
        editor.commands.execute('indent', 'decrease');
      },
    );
  });

  it('decreases indent twice', () => {
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
        editor.commands.execute('indent', 'decrease');
        editor.commands.execute('indent', 'decrease');
      },
    );
  });

});
