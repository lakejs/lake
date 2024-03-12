import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugin / arrow-keys', () => {

  it('left key: box input', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: cursor is on the left strip of the inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: cursor is on the right strip of the inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: inline box is selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: cursor is outside the end of the inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: cursor is on the left strip of the block box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    <p>bar</p>
    `;
    const output = `
    <p>foo<focus /></p>
    <lake-box type="block" name="hr"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: cursor is on the right strip of the block box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: block box is selected', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: two inline boxes', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('right key: box input', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: cursor is on the left strip of the inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: cursor is on the right strip of the inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: inline box is selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: cursor is outside the start of the inline box', () => {
    const content = `
    <p>foo<focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: cursor is on the left strip of the block box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: cursor is on the right strip of the block box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr"></lake-box>
    <p><focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: block box is selected', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: two inline boxes', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('up key: box input', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        editor.keystroke.keydown('arrow-up');
      },
    );
  });

  it('up key: inline box is selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-up');
      },
    );
  });

  it('up key: block box is selected', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bar</p>
    `;
    const output = `
    <p>foo<focus /></p>
    <lake-box type="block" name="hr"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-up');
      },
    );
  });

  it('down key: box input', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        editor.keystroke.keydown('arrow-down');
      },
    );
  });

  it('down key: inline box is selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-down');
      },
    );
  });

  it('down key: block box is selected', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr"></lake-box>
    <p><focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-down');
      },
    );
  });

});
