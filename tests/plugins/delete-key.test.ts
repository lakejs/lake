import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / delete-key', () => {

  it('no content', () => {
    const content = `
    <focus />
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('wrong content', () => {
    const content = `
    <focus /><br /><p></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('empty paragraph', () => {
    const content = `
    <p><focus /><br /></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should delete br without text', () => {
    const content = `
    <p><focus /><br /><br /></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should delete br with text', () => {
    const content = `
    <p>foo<focus /><br /><br /></p>
    `;
    const output = `
    <p>foo<focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should delete a table when the cursor is positioned before it', () => {
    const content = `
    <h1>foo</h1>
    <focus />
    <table>
      <tr>
        <td>bar</td>
      </tr>
    </table>
    `;
    const output = `
    <h1>foo</h1>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('table: should delete next table when the cursor is positioned at the end of a paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    <table>
      <tr>
        <td>bar</td>
      </tr>
    </table>
    `;
    const output = `
    <p>foo<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should merge empty paragraphs', () => {
    const content = `
    <p><focus /><br /></p>
    <p><br /></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should merge paragraph into heading', () => {
    const content = `
    <h1>foo<focus /></h1>
    <p>bar</p>
    `;
    const output = `
    <h1>foo<focus />bar</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should merge empty paragraph into heading', () => {
    const content = `
    <h1>foo<focus /></h1>
    <p><br /></p>
    `;
    const output = `
    <h1>foo<focus /></h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should delete contents and merge two blocks', () => {
    const content = `
    <p>fo<anchor />o</p>
    <p>b<focus />ar</p>
    `;
    const output = `
    <p>fo<focus />ar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should move cursor into a box in the next paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    <lake-box type="block" name="hr"></lake-box>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove empty paragraph when the next block is a box', () => {
    const content = `
    <p><focus /><br /></p>
    <lake-box type="block" name="hr"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="start"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove empty next paragraph after box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p><br /></p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove box after selecting the beginning of box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="start"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <p><focus /><br /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should move cursor into paragraph after box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <p><focus />foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove box after selecting the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <p><focus /><br /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should become native behavior when cursor is in the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should merge two blocks that include only inline boxes (1)', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box></p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    `;
    const output = `
    <p>
      <lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>
    </p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should merge two blocks that include only inline boxes (2)', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus /></p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    `;
    const output = `
    <p>
      <lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>
    </p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove inline box (1)', () => {
    const content = `
    <p>foo</p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove inline box (2)', () => {
    const content = `
    <p>foo</p>
    <p><focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove br before inline box', () => {
    const content = `
    <p>foo</p>
    <p><focus /><br /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove the next inline box when focus is at the end of an inline box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    `;
    const output = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should keep empty paragraph after removing all content', () => {
    const content = `
    <anchor /><p>foo</p><focus />
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

});
