import { testPlugin } from '../utils';

describe('plugin / markdown', () => {

  it('keystroke: sets heading 1', () => {
    const content = `
    <p>#<focus />foo</p>
    `;
    const output = `
    <h1><focus />foo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets heading 2', () => {
    const content = `
    <p>##<focus />foo</p>
    `;
    const output = `
    <h2><focus />foo</h2>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets heading 3', () => {
    const content = `
    <p>###<focus />foo</p>
    `;
    const output = `
    <h3><focus />foo</h3>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets heading 4', () => {
    const content = `
    <p>####<focus />foo</p>
    `;
    const output = `
    <h4><focus />foo</h4>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets heading 5', () => {
    const content = `
    <p>#####<focus />foo</p>
    `;
    const output = `
    <h5><focus />foo</h5>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets heading 6', () => {
    const content = `
    <p>######<focus />foo</p>
    `;
    const output = `
    <h6><focus />foo</h6>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: should set heading 6 when there are more than six', () => {
    const content = `
    <p>#######<focus />foo</p>
    `;
    const output = `
    <h6><focus />foo</h6>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: should not set heading 1 in blockquote', () => {
    const content = `
    <blockquote>#<focus />foo</blockquote>
    `;
    const output = `
    <blockquote>#<focus />foo</blockquote>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: should append br', () => {
    const content = `
    <p>#<focus /></p>
    `;
    const output = `
    <h1><br /><focus /></h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets numbered list (1. space)', () => {
    const content = `
    <p>1.<focus />foo</p>
    `;
    const output = `
    <ol start="1"><li><focus />foo</li></ol>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets numbered list (2. space)', () => {
    const content = `
    <p>2.<focus />foo</p>
    `;
    const output = `
    <ol start="1"><li><focus />foo</li></ol>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets bulleted list (* space)', () => {
    const content = `
    <p>*<focus />foo</p>
    `;
    const output = `
    <ul><li><focus />foo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets bulleted list (- space)', () => {
    const content = `
    <p>-<focus />foo</p>
    `;
    const output = `
    <ul><li><focus />foo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets bulleted list (+ space)', () => {
    const content = `
    <p>+<focus />foo</p>
    `;
    const output = `
    <ul><li><focus />foo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets checklist ([] space)', () => {
    const content = `
    <p>[]<focus />foo</p>
    `;
    const output = `
    <ul type="checklist"><li value="false"><focus />foo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets checklist ([ ] space)', () => {
    const content = `
    <p>[ ]<focus />foo</p>
    `;
    const output = `
    <ul type="checklist"><li value="false"><focus />foo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets checklist ([x] space)', () => {
    const content = `
    <p>[x]<focus />foo</p>
    `;
    const output = `
    <ul type="checklist"><li value="true"><focus />foo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets checklist ([X] space)', () => {
    const content = `
    <p>[X]<focus />foo</p>
    `;
    const output = `
    <ul type="checklist"><li value="true"><focus />foo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: sets blockquote', () => {
    const content = `
    <p>&gt;<focus />foo</p>
    `;
    const output = `
    <blockquote><focus />foo</blockquote>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: adds bold (**bold** space)', () => {
    const content = `
    <p>foo**bold**<focus />bar</p>
    `;
    const output = `
    <p>foo<strong>bold</strong>\u200B<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: adds bold (__bold__ space)', () => {
    const content = `
    <p>__foo__<focus />bar</p>
    `;
    const output = `
    <p><strong>foo</strong>\u200B<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: adds bold (_italic_ space)', () => {
    const content = `
    <p>_foo_<focus />bar</p>
    `;
    const output = `
    <p><i>foo</i>\u200B<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: adds bold (*italic* space)', () => {
    const content = `
    <p>*foo*<focus />bar</p>
    `;
    const output = `
    <p><i>foo</i>\u200B<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: adds highlight', () => {
    const content = `
    <p>==foo==<focus />bar</p>
    `;
    const output = `
    <p><span style="background-color: #fff566;">foo</span>\u200B<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: adds strikethrough', () => {
    const content = `
    <p>~~foo~~<focus />bar</p>
    `;
    const output = `
    <p><s>foo</s>\u200B<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: adds code', () => {
    const content = `
    <p>\`foo\`<focus />bar</p>
    `;
    const output = `
    <p><code>foo</code>\u200B<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: with zero width space', () => {
    const content = `
    <p><strong>\u200B#<focus />foo</strong></p>
    `;
    const output = `
    <h1><strong><focus />foo</strong></h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: with empty mark', () => {
    const content = `
    <p><strong>\u200B#<focus /></strong></p>
    `;
    const output = `
    <h1><strong>\u200B<focus /></strong></h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

});
