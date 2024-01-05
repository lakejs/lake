import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuL2RhdGEvY293LmpwZyJ9';

describe('plugin / backspace-key', () => {

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
        editor.keystroke.keydown('backspace');
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
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('sets heading to paragraph', () => {
    const content = `
    <h1><br /><focus /></h1>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('sets list to paragraph', () => {
    const content = `
    <h1>heading</h1>
    <ul><li><focus />foo</li></ul>
    <ul><li>bar</li></ul>
    `;
    const output = `
    <h1>heading</h1>
    <p><focus />foo</p>
    <ul><li>bar</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('sets blockquote to paragraph', () => {
    const content = `
    <h1>heading</h1>
    <blockquote><focus />foo</blockquote>
    <blockquote>bar</blockquote>
    `;
    const output = `
    <h1>heading</h1>
    <p><focus />foo</p>
    <blockquote>bar</blockquote>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('merges empty paragraphs', () => {
    const content = `
    <p><br /></p>
    <p><br /><focus /></p>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('merges paragraph into heading', () => {
    const content = `
    <h1>foo</h1>
    <p><focus />bar</p>
    `;
    const output = `
    <h1>foo<focus />bar</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('merges empty paragraph into heading', () => {
    const content = `
    <h1>foo</h1>
    <p><br /><focus /></p>
    `;
    const output = `
    <h1>foo<focus /></h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
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
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should move cursor with box before paragraph', () => {
    const content = `
    <lake-box type="block" name="hr"></lake-box>
    <p><focus />foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove empty paragraph with box before empty paragraph', () => {
    const content = `
    <lake-box type="block" name="hr"></lake-box>
    <p><br /><focus /></p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="right"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove empty paragraph before box', () => {
    const content = `
    <p><br /></p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="left"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should move cursor with paragraph before box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    `;
    const output = `
    <p>foo<focus /></p>
    <lake-box type="block" name="hr"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove box after selecting the end of box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    `;
    const output = `
    <p>foo</p>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove box after selecting the box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    `;
    const output = `
    <p>foo</p>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('becomes native behavior when cursor is in the box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus />bar</p>
    `;
    const output = `
    <p>foo<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
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
        editor.keystroke.keydown('backspace');
      },
    );
  });

});
