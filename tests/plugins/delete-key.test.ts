import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuL2RhdGEvY293LmpwZyJ9';

describe('plugin / delete-key', () => {

  it('no content', () => {
    const content = `
    <focus />
    `;
    const output = `
    <p><br /><focus /></p>
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
    <p><br /><focus /></p>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('merges empty paragraphs', () => {
    const content = `
    <p><br /><focus /></p>
    <p><br /></p>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('merges paragraph into heading', () => {
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

  it('merges empty paragraph into heading', () => {
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

  it('should move cursor with box after paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    <lake-box type="block" name="hr"></lake-box>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove empty paragraph with box after empty paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    <lake-box type="block" name="hr"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="left"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('delete');
      },
    );
  });

  it('should remove empty paragraph after box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p><br /></p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="right"></lake-box>
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
    <lake-box type="block" name="hr" focus="left"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <p><br /><focus /></p>
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

  it('should move cursor with paragraph after box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="right"></lake-box>
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
    <p><br /><focus /></p>
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

  it('becomes native behavior when cursor is in the box', () => {
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

  it('should remove inline box', () => {
    const content = `
    <p>foo<focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<focus />bar</p>
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
    <p><br /><focus /></p>
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
