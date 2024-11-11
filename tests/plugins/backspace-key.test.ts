import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / backspace-key', () => {

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
        editor.keystroke.keydown('backspace');
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
        editor.keystroke.keydown('backspace');
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
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete a br without text', () => {
    const content = `
    <p><br /><focus /><br /></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete a br with text', () => {
    const content = `
    <p>foo<br /><focus /><br /></p>
    `;
    const output = `
    <p>foo<focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete a br that is part of a sequence of br nodes (1)', () => {
    const content = `
    <p>foo<br /><br /><focus /><br /></p>
    `;
    const output = `
    <p>foo<br /><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete a br that is part of a sequence of br nodes (2)', () => {
    const content = `
    <p>foo<br /><br /><br /><focus /><br /><br /></p>
    `;
    const output = `
    <p>foo<br /><br /><focus /><br /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete a br that is part of a sequence of br nodes (3)', () => {
    const content = `
    <h1>foo</h1>
    <p><focus /><br /><br /></p>
    `;
    const output = `
    <h1>foo<focus /></h1>
    <p><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete a br that is part of a sequence of br nodes (4)', () => {
    const content = `
    <p>foo</p>
    <p><focus /><br /><br /></p>
    `;
    const output = `
    <p>foo<focus /><br /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete the previous text of length 1', () => {
    const content = `
    <p>f<focus /></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('native behavior: the previous text of length 1 with zero width space', () => {
    const content = `
    <p><code>f<focus /></code>\u200B</p>
    `;
    const output = `
    <p><code>f<focus /></code>\u200B</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should set a heading without previous block to a paragraph', () => {
    const content = `
    <h1><focus /><br /></h1>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should set a list to a paragraph', () => {
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

  it('should set a blockquote to a paragraph', () => {
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

  it('should merge two empty paragraphs', () => {
    const content = `
    <p><br /></p>
    <p><focus /><br /></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should merge a paragraph into a heading', () => {
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

  it('should merge an empty paragraph into a paragraph', () => {
    const content = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    const output = `
    <p>foo<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should merge an empty paragraph into a heading', () => {
    const content = `
    <h1>foo</h1>
    <p><focus /><br /></p>
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

  it('should remove empty mark (1)', () => {
    const content = `
    <h1>foo</h1>
    <p><code><focus /><br /></code></p>
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

  it('should remove empty mark (2)', () => {
    const content = `
    <p><strong></strong><focus /><br /></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove empty link (1)', () => {
    const content = `
    <h1>foo</h1>
    <p><a href="bar"><focus /><br /></a></p>
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

  it('should remove empty link (2)', () => {
    const content = `
    <p><a href="#"></a><focus /><br /></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should merge heading into paragraph', () => {
    const content = `
    <p>foo</p>
    <h1><focus />bar</h1>
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

  it('should not merge heading into empty paragraph', () => {
    const content = `
    <p><br /></p>
    <h1><focus />bar</h1>
    `;
    const output = `
    <h1><focus />bar</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete part of text', () => {
    const content = `
    <p>foo</p>
    <p>b<anchor />a<focus />r</p>
    `;
    const output = `
    <p>foo</p>
    <p>b<focus />r</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete all text', () => {
    const content = `
    <p>foo</p>
    <p><anchor />bar<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
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

  it('table: should delete br', () => {
    const content = `
    <table>
      <tr>
        <td>foo<br /><p><focus />bar</p></td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>foo<p><focus />bar</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('table: should merge with text', () => {
    const content = `
    <table>
      <tr>
        <td>foo<p><focus />bar</p></td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><p>foo<focus />bar</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('table: should delete content which includes table', () => {
    const content = `
    <p><anchor />foo</p>
    <table>
      <tr>
        <td>foo<br /><p>bar</p></td>
      </tr>
    </table>
    <p><focus /><br /></p>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('table: empty content', () => {
    const content = `
    <table>
      <tr>
        <td><p><focus /><br /></p></td>
      </tr>
    </table>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should move cursor into a box in the previous paragraph', () => {
    const content = `
    <lake-box type="block" name="hr"></lake-box>
    <p><focus />foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
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

  it('should remove empty paragraph when the previous block is a box', () => {
    const content = `
    <lake-box type="block" name="hr"></lake-box>
    <p><focus /><br /></p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove empty previous paragraph before box', () => {
    const content = `
    <p><br /></p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="start"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should move cursor into the previous paragraph before box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
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

  it('should move cursor into a box in the previous paragraph before box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
    `;
    const output = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box></p>
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

  it('should delete the previous text of length 1 before box (1)', () => {
    const content = `
    <p>f<lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box></p>
    `;
    const output = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should delete the previous text of length 1 before box (2)', () => {
    const content = `
    <p>f<focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    `;
    const output = `
    <p><focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
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
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
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
    <p><focus /><br /></p>
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

  it('should merge two blocks that include only inline boxes (1)', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box></p>
    `;
    const output = `
    <p>
      <lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box>
    </p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should merge two blocks that include only inline boxes (2)', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    <p><focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
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
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove inline box (1)', () => {
    const content = `
    <p>foo</p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove inline box (2)', () => {
    const content = `
    <p>foo</p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus /></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove br after inline box', () => {
    const content = `
    <p>foo</p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><br /><focus /><br /></p>
    `;
    const output = `
    <p>foo</p>
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove the previous inline box when focus is at the beginning of an inline box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}" focus="start"></lake-box></p>
    `;
    const output = `
    <p><focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
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
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('paragraph: should decrease text indent', () => {
    const content = `
    <p>foo</p>
    <p style="text-indent: 2em;"><focus />heading</p>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <p><focus />heading</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('paragraph: should decrease indent', () => {
    const content = `
    <p>foo</p>
    <p style="text-indent: 2em; margin-left: 40px;"><focus />heading</p>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <p style="text-indent: 2em;"><focus />heading</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('list: should decrease indent', () => {
    const content = `
    <ul indent="1"><li><focus />foo</li></ul>
    <p>bar</p>
    `;
    const output = `
    <ul><li><focus />foo</li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove empty code block when selected range is collapsed', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="codeBlock" focus="center"></lake-box>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const boxNode = editor.container.find('lake-box');
        editor.selection.range.setStart(boxNode.find('.cm-line'), 0);
        editor.selection.range.collapseToStart();
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should not remove empty code block when selected range is expanded', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="codeBlock" focus="center"></lake-box>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="codeBlock" focus="center"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const boxNode = editor.container.find('lake-box');
        boxNode.find('.cm-line').text('foo');
        editor.selection.range.selectNodeContents(boxNode.find('.cm-line'));
        editor.keystroke.keydown('backspace');
      },
    );
  });

});
