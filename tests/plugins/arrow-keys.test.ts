import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / arrow-keys', () => {

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
        editor.keystroke.keydown('left');
      },
    );
  });

  it('left key: cursor is on the start strip of the inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('left');
      },
    );
  });

  it('left key: cursor is on the end strip of the inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('left');
      },
    );
  });

  it('left key: inline box is selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('left');
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
        editor.keystroke.keydown('left');
      },
    );
  });

  it('left key: cursor is on the start strip of the block box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
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
        editor.keystroke.keydown('left');
      },
    );
  });

  it('left key: cursor is on the end strip of the block box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
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
        editor.keystroke.keydown('left');
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
    <lake-box type="block" name="hr" focus="start"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('left');
      },
    );
  });

  it('left key: two inline boxes', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('left');
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
        editor.keystroke.keydown('right');
      },
    );
  });

  it('right key: cursor is on the start strip of the inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('right');
      },
    );
  });

  it('right key: cursor is on the end strip of the inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('right');
      },
    );
  });

  it('right key: inline box is selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('right');
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
        editor.keystroke.keydown('right');
      },
    );
  });

  it('right key: cursor is on the start strip of the block box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
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
        editor.keystroke.keydown('right');
      },
    );
  });

  it('right key: cursor is on the end strip of the block box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
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
        editor.keystroke.keydown('right');
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
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('right');
      },
    );
  });

  it('right key: two inline boxes', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('right');
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
        editor.keystroke.keydown('up');
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
        editor.keystroke.keydown('up');
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
        editor.keystroke.keydown('up');
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
        editor.keystroke.keydown('down');
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
        editor.keystroke.keydown('down');
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
        editor.keystroke.keydown('down');
      },
    );
  });

});
