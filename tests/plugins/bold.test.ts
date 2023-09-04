import { testPlugin } from '../utils';

describe('bold plugin', () => {

  it('cursor state: between the characters of the text', () => {
    const content = `
    <p>f<focus />oo</p>
    <p>bar</p>
    `;
    const output = `
    <p>f<strong>\u200B<focus /></strong>oo</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('bold');
      },
    );
  });

  it('cursor state, toggling: between the characters of the text', () => {
    const content = `
    <p>f<focus />oo</p>
    <p>bar</p>
    `;
    const output = `
    <p>f<focus />oo</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('bold');
        editor.commands.run('bold');
      },
    );
  });

  it('cursor state: at the end of the text', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <p>foo<strong>\u200B<focus /></strong></p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('bold');
      },
    );
  });

  it('cursor state: at the beginning of the text', () => {
    const content = `
    <p><focus />foo</p>
    <p>bar</p>
    `;
    const output = `
    <p><strong>\u200B<focus /></strong>foo</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('bold');
      },
    );
  });

  it('selecting state: anchor and focus are between the characters of the text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    <p>foo</p>
    `;
    const output = `
    <p>one<anchor /><strong>two</strong><focus />three</p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('bold');
      },
    );
  });

  it('selecting state: anchor is at the beginning of the text', () => {
    const content = `
    <p><anchor />two<focus />three</p>
    <p>foo</p>
    `;
    const output = `
    <p><anchor /><strong>two</strong><focus />three</p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('bold');
      },
    );
  });

  it('selecting state: focus is at the end of the text', () => {
    const content = `
    <p>one<anchor />two<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <p>one<anchor /><strong>two</strong><focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.run('bold');
      },
    );
  });

});
