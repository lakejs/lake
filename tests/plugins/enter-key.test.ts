import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / enter-key', () => {

  it('paragraph: no content', () => {
    const content = `
    <focus />
    `;
    const output = `
    <p><br /></p>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: wrong content', () => {
    const content = `
    <focus /><br /><p></p>
    `;
    const output = `
    <p><br /></p>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: empty paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><br /></p>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: the focus is between the characters of the text', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>f</p>
    <p><focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: the focus is at the beginning of the text', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <p><br /></p>
    <p><focus />foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: the focus is at the end of the text', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: should create a new block when there is no closest block', () => {
    const content = `
    foo<focus />bar
    `;
    const output = `
    <p>foo</p>
    <p><focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('heading: should become paragraph when the focus is at the end of the heading', () => {
    const content = `
    <h1>foo<focus /></h1>
    `;
    const output = `
    <h1>foo</h1>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('heading: should not become paragraph when the focus is at the beginning of the heading', () => {
    const content = `
    <h1><focus />foo</h1>
    `;
    const output = `
    <h1><br /></h1>
    <h1><focus />foo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('heading: selecting all content', () => {
    const content = `
    <anchor /><h1>foo</h1><focus />
    `;
    const output = `
    <h1><br /></h1>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('heading: selecting a block', () => {
    const content = `
    <anchor /><h1>foo</h1><focus />
    <h2>bar</h2>
    `;
    const output = `
    <h1><br /></h1>
    <p><br /><focus /></p>
    <h2>bar</h2>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('heading: selecting a block and the beginning of next block', () => {
    const content = `
    <anchor /><h1>foo</h1>
    <h2><focus />bar</h2>
    `;
    const output = `
    <h1><br /></h1>
    <p><br /><focus /></p>
    <h2>bar</h2>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('blockquote: should become paragraph when the focus is at the end of the blockquote', () => {
    const content = `
    <blockquote>foo<focus /></blockquote>
    `;
    const output = `
    <blockquote>foo</blockquote>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('blockquote: should not become paragraph when the focus is at the beginning of the blockquote', () => {
    const content = `
    <blockquote><focus />foo</blockquote>
    `;
    const output = `
    <blockquote><br /></blockquote>
    <blockquote><focus />foo</blockquote>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('list: the focus is between the characters of the text', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>f</li></ul>
    <ul><li><focus />oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('list: empty content', () => {
    const content = `
    <ul><li>foo</li></ul>
    <ul><li><br /><focus /></li></ul>
    `;
    const output = `
    <ul><li>foo</li></ul>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('list: should keep correct number', () => {
    const content = `
    <ol start="1"><li>f<focus />oo</li></ol>
    `;
    const output = `
    <ol start="1"><li>f</li></ol>
    <ol start="2"><li><focus />oo</li></ol>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('checklist: the focus is at the end of the text', () => {
    const content = `
    <ul type="checklist"><li value="true">foo<focus /></li></ul>
    `;
    const output = `
    <ul type="checklist"><li value="true">foo</li></ul>
    <ul type="checklist"><li value="false"><br /><focus /></li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('table: should not split td', () => {
    const content = `
    <table>
      <tr>
        <td>foo1<anchor />bar1</td>
        <td>foo2<focus />bar2</td>
      </tr>
    </table>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is at the beginning of block box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="start"></lake-box>
    `;
    const output = `
    <p><br /></p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is at the end of block box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is outside the beginning of block box', () => {
    const content = `
    <focus /><lake-box type="block" name="hr"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <p><br /></p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is outside the end of block box', () => {
    const content = `
    <lake-box type="block" name="hr"></lake-box><focus />
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <p><br /></p>
    <p><focus />foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is at the center of block box', () => {
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
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is in the block box', () => {
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
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is at the beginning of inline box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box></p>
    `;
    const output = `
    <p><br /></p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is at the end of inline box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box></p>
    `;
    const output = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is outside the beginning of inline box', () => {
    const content = `
    <p><focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    <p>foo</p>
    `;
    const output = `
    <p><br /></p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is outside the end of inline box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus /></p>
    <p>foo</p>
    `;
    const output = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    <p><br /><focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is at the center of inline box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box></p>
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
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is in the inline box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box></p>
    <p>foo</p>
    `;
    const output = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        editor.keystroke.keydown('enter');
      },
    );
  });

});
