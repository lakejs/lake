import { testPlugin } from '../utils';

describe('bold plugin', () => {

  it('the focus is between the characters of the text', () => {
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
        editor.command.execute('bold');
      },
    );
  });

  it('toggling: the focus is between the characters of the text', () => {
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
        editor.command.execute('bold');
        editor.command.execute('bold');
      },
    );
  });

  it('executes three times: the focus is between the characters of the text', () => {
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
        editor.command.execute('bold');
        editor.command.execute('bold');
        editor.command.execute('bold');
      },
    );
  });

  it('the focus is at the end of the text of the paragraph', () => {
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
        editor.command.execute('bold');
      },
    );
  });

  it('the focus is at the end of the text of the strong', () => {
    const content = `
    <p>foo<strong>bold<focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<strong>bold</strong>\u200B<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('bold');
      },
    );
  });

  it('toggling: the focus is at the end of the text', () => {
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
        editor.command.execute('bold');
        editor.command.execute('bold');
      },
    );
  });

  it('the focus is at the beginning of the text', () => {
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
        editor.command.execute('bold');
      },
    );
  });

  it('toggling: the focus is at the beginning of the text', () => {
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
        editor.command.execute('bold');
        editor.command.execute('bold');
      },
    );
  });

  it('the anchor and the focus are between the characters of the text', () => {
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
        editor.command.execute('bold');
      },
    );
  });

  it('toggling: the anchor and the focus are between the characters of the text', () => {
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
        editor.command.execute('bold');
        editor.command.execute('bold');
      },
    );
  });

  it('executes three times: the anchor and the focus are between the characters of the text', () => {
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
        editor.command.execute('bold');
        editor.command.execute('bold');
        editor.command.execute('bold');
      },
    );
  });

  it('expanded range: the anchor is at the beginning of the text', () => {
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
        editor.command.execute('bold');
      },
    );
  });

  it('expanded range: the focus is at the end of the text', () => {
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
        editor.command.execute('bold');
      },
    );
  });

  it('the focus is in another strong element', () => {
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
        editor.command.execute('bold');
      },
    );
  });

  it('the focus is in another mark', () => {
    const content = `
    <p><em>f<focus />oo</em></p>
    <p>bar</p>
    `;
    const output = `
    <p><em>f</em><strong><em>\u200B<focus /></em></strong><em>oo</em></p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.commandexecute('bold');
      },
    );
  });

  it('keyboard shortcut', () => {
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
        editor.keystroke.keydown('mod+b');
      },
    );
  });

});
