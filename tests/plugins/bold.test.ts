import { testPlugin } from '../utils';

describe('bold plugin', () => {

  it('no text is selected: between the characters of the text', () => {
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
        editor.commands.execute('bold');
      },
    );
  });

  it('toggling, no text is selected: between the characters of the text', () => {
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
        editor.commands.execute('bold');
        editor.commands.execute('bold');
      },
    );
  });

  it('no text is selected: in the other strong tag', () => {
    const content = `
    <p><strong>f<focus />oo</strong></p>
    <p>bar</p>
    `;
    const output = `
    <p><strong>f</strong>\u200B<focus /><strong>oo</strong></p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
      },
    );
  });

  it('execute three times, no text is selected: between the characters of the text', () => {
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
        editor.commands.execute('bold');
        editor.commands.execute('bold');
        editor.commands.execute('bold');
      },
    );
  });

  it('no text is selected: at the end of the text', () => {
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
        editor.commands.execute('bold');
      },
    );
  });

  it('toggling, no text is selected: at the end of the text', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
        editor.commands.execute('bold');
      },
    );
  });

  it('no text is selected: at the beginning of the text', () => {
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
        editor.commands.execute('bold');
      },
    );
  });

  it('toggling, no text is selected: at the beginning of the text', () => {
    const content = `
    <p><focus />foo</p>
    <p>bar</p>
    `;
    const output = `
    <p><focus />foo</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
        editor.commands.execute('bold');
      },
    );
  });

  it('text is selected: anchor and focus are between the characters of the text', () => {
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
        editor.commands.execute('bold');
      },
    );
  });

  it('toggling, text is selected: anchor and focus are between the characters of the text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    <p>foo</p>
    `;
    const output = `
    <p>one<anchor />two<focus />three</p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commands.execute('bold');
        editor.commands.execute('bold');
      },
    );
  });

  it('execute three times, text is selected: anchor and focus are between the characters of the text', () => {
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
        editor.commands.execute('bold');
        editor.commands.execute('bold');
        editor.commands.execute('bold');
      },
    );
  });

  it('text is selected: anchor is at the beginning of the text', () => {
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
        editor.commands.execute('bold');
      },
    );
  });

  it('text is selected: focus is at the end of the text', () => {
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
        editor.commands.execute('bold');
      },
    );
  });

});
