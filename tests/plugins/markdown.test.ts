import { Box } from '../../src';
import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / markdown', () => {

  it('keystroke: should set heading 1', () => {
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

  it('keystroke: should not set heading 1 when heading command does not exist', () => {
    const content = `
    <p>#<focus />foo</p>
    `;
    const output = `
    <p>#<focus />foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.delete('heading');
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: should set heading 2', () => {
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

  it('keystroke: should set heading 3', () => {
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

  it('keystroke: should set heading 4', () => {
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

  it('keystroke: should set heading 5', () => {
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

  it('keystroke: should set heading 6', () => {
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

  it('keystroke: should append br with empty text', () => {
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
        const range = editor.selection.range;
        const block = range.startNode.closestBlock();
        block.prepend(document.createTextNode(''));
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: space key behavior should be normal when focus is in a box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box></p>
    `;
    const output = content;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: should set numbered list (1. space)', () => {
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

  it('keystroke: should set numbered list (2. space)', () => {
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

  it('keystroke: should set bulleted list (* space)', () => {
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

  it('keystroke: should set bulleted list (- space)', () => {
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

  it('keystroke: should set bulleted list (+ space)', () => {
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

  it('keystroke: should set checklist ([] space)', () => {
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

  it('keystroke: should set checklist ([ ] space)', () => {
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

  it('keystroke: should set checklist ([x] space)', () => {
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

  it('keystroke: should set checklist ([X] space)', () => {
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

  it('keystroke: should set blockquote', () => {
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

  it('keystroke: should add bold (**bold** space)', () => {
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

  it('keystroke: should not add bold when bold command does not exist', () => {
    const content = `
    <p>foo**bold**<focus />bar</p>
    `;
    const output = `
    <p>foo**bold**<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.delete('bold');
        editor.keystroke.keydown('space');
      },
    );
  });

  it('keystroke: should add bold (__bold__ space)', () => {
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

  it('keystroke: should add italic (_italic_ space)', () => {
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

  it('keystroke: should add italic (*italic* space)', () => {
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

  it('keystroke: should add highlight', () => {
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

  it('keystroke: should add strikethrough', () => {
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

  it('keystroke: should add code', () => {
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

  it('keystroke: should set heading with zero width space', () => {
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

  it('keystroke: should set heading with empty mark', () => {
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

  it('keystroke: should insert hr', () => {
    const content = `
    <p>---<focus /></p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('keystroke: should insert hr when text includes zeroWidthSpace', () => {
    const content = `
    <p>\u200B---\u200B<focus /></p>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('keystroke: should not insert hr when block includes box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>---<focus /></p>
    `;
    const output = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>---</p>
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

  it('keystroke: should not inset hr in blockquote', () => {
    const content = `
    <blockquote>---<focus /></blockquote>
    `;
    const output = `
    <blockquote>---</blockquote>
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

  it('keystroke: enter key behavior should be normal when focus is in a box', () => {
    const content = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box>---</p>
    `;
    const output = `
    <p><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box></p>
    <p><focus />---</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('keystroke: should insert codeBlock', () => {
    const content = '<p>```<focus /></p>';
    const output = `
    <lake-box type="block" name="codeBlock" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('keystroke: should not insert codeBlock when codeBlock command does not exist', () => {
    const content = '<p>```<focus /></p>';
    const output = '<p>```</p><p><br /><focus /></p>';
    testPlugin(
      content,
      output,
      editor => {
        editor.command.delete('codeBlock');
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('keystroke: should insert a codeBlock with language type', () => {
    const content = '<p>```css<focus /></p>';
    const output = `
    <lake-box type="block" name="codeBlock" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
        const boxNode = editor.container.find('lake-box');
        const box = new Box(boxNode);
        expect(box.value.lang).to.equal('css');
      },
      true,
    );
  });

  it('keystroke: should insert a codeBlock with unknown language type', () => {
    const content = '<p>```foo<focus /></p>';
    const output = `
    <lake-box type="block" name="codeBlock" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
        const boxNode = editor.container.find('lake-box');
        const box = new Box(boxNode);
        expect(box.value.lang).to.equal('foo');
      },
      true,
    );
  });

});
