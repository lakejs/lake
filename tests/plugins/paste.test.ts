import type { Editor } from '../../src';
import { testPlugin } from '../utils';

// const imageUrl = './data/cow.jpg';
const imageBoxValue = 'eyJ1cmwiOiIuL2RhdGEvY293LmpwZyJ9';

function pasteData(editor: Editor, format: string, data: string) {
  const event = new ClipboardEvent('paste', {
    clipboardData: new DataTransfer(),
  });
  event.clipboardData?.setData(format, data);
  editor.container.emit('paste', event);
}

describe('plugin / paste', () => {

  it('pastes plain text into empty content', () => {
    const content = `
    <focus />
    `;
    const output = `
    <p>bar<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'bar');
      },
    );
  });

  it('pastes plain text into an empty paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p>bar<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'bar');
      },
    );
  });

  it('pastes plain text into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fbar<focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'bar');
      },
    );
  });

  it('pastes HTML as plain text into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>f&lt;p&gt;bar&lt;/p&gt;<focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', '<p>bar</p>');
      },
    );
  });

  it('pastes plain text into a heading', () => {
    const content = `
    <h1>f<focus />oo</h1>
    `;
    const output = `
    <h1>fbar<focus />oo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'bar');
      },
    );
  });

  it('pastes plain text into a list', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>fbar<focus />oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'bar');
      },
    );
  });

  it('pastes plain text when cursor is on the left side of hr', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <p>bar<focus /></p>
    <lake-box type="block" name="hr"></lake-box>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'bar');
      },
    );
  });

  it('pastes plain text when cursor is on the right side of hr', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <lake-box type="block" name="hr"></lake-box>
    <p>bar<focus /></p>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'bar');
      },
    );
  });

  it('pastes plain text when cursor is on the center of hr', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <p>bar<focus /></p>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'bar');
      },
    );
  });

  it('becomes native behavior when cursor is in the box', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(range.startNode, 1);
        pasteData(editor, 'text/plain', 'bar');
      },
    );
  });

  it('pastes multi-line plain text into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fone</p>
    <p>two<focus /></p>
    <p>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'one\ntwo');
      },
    );
  });

  it('pastes multi-line plain text into a heading', () => {
    const content = `
    <h1>f<focus />oo</h1>
    `;
    const output = `
    <h1>fone</h1>
    <p>two<focus /></p>
    <h1>oo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'one\ntwo');
      },
    );
  });

  it('pastes multi-line plain text into a list', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>fone</li></ul>
    <p>two<focus /></p>
    <ul><li>oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/plain', 'one\ntwo');
      },
    );
  });

  it('pastes a paragraph into empty content', () => {
    const content = `
    <focus />
    `;
    const output = `
    <p>bar<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p>bar</p>');
      },
    );
  });

  it('pastes a paragraph into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fbar<focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p>bar</p>');
      },
    );
  });

  it('pastes a paragraph into a heading', () => {
    const content = `
    <h1>f<focus />oo</h1>
    `;
    const output = `
    <h1>fbar<focus />oo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p>bar</p>');
      },
    );
  });

  it('pastes a paragraph into a list', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>fbar<focus />oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p>bar</p>');
      },
    );
  });

  it('pastes multi-paragraph into a empty paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p>one</p>
    <p>two<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p>one</p><p>two</p>');
      },
    );
  });

  it('pastes multi-paragraph into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fone</p>
    <p>two<focus /></p>
    <p>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p>one</p><p>two</p>');
      },
    );
  });

  it('pastes multi-pragraph into a heading', () => {
    const content = `
    <h1>f<focus />oo</h1>
    `;
    const output = `
    <h1>fone</h1>
    <p>two<focus /></p>
    <h1>oo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p>one</p><p>two</p>');
      },
    );
  });

  it('pastes multi-pragraph into a list', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>fone</li></ul>
    <p>two<focus /></p>
    <ul><li>oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p>one</p><p>two</p>');
      },
    );
  });

  it('pastes a heading into an empty paragraph', () => {
    const content = `
    <p>foo</p>
    <p><br /><focus /></p>
    `;
    const output = `
    <p>foo</p>
    <h1>bar<focus /></h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<h1>bar</h1>');
      },
    );
  });

  it('pastes a heading into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fbar<focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<h1>bar</h1>');
      },
    );
  });

  it('pastes a heading into another heading', () => {
    const content = `
    <h1>f<focus />oo</h1>
    `;
    const output = `
    <h1>fbar<focus />oo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<h2>bar</h2>');
      },
    );
  });

  it('pastes a heading into a list', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>fbar<focus />oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<h2>bar</h2>');
      },
    );
  });

  it('pastes a heading when cursor is on the left side of hr', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <h2>bar<focus /></h2>
    <lake-box type="block" name="hr"></lake-box>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<h2>bar</h2>');
      },
    );
  });

  it('pastes a heading when cursor is on the right side of hr', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <lake-box type="block" name="hr"></lake-box>
    <h2>bar<focus /></h2>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<h2>bar</h2>');
      },
    );
  });

  it('pastes a list into empty content', () => {
    const content = `
    <focus />
    `;
    const output = `
    <ul><li>bar<focus /></li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li>bar</li></ul>');
      },
    );
  });

  it('pastes a list into an empty paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <ul><li>bar<focus /></li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li>bar</li></ul>');
      },
    );
  });

  it('pastes a list into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fbar<focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li>bar</li></ul>');
      },
    );
  });

  it('pastes a list into a heading', () => {
    const content = `
    <h1>f<focus />oo</h1>
    `;
    const output = `
    <h1>fbar<focus />oo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li>bar</li></ul>');
      },
    );
  });

  it('pastes a list into a list', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>fbar<focus />oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li>bar</li></ul>');
      },
    );
  });

  it('pastes multi-list into an empty paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <ul><li>one</li></ul>
    <ul><li>two<focus /></li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li>one</li></ul><ul><li>two</li></ul>');
      },
    );
  });

  it('pastes multi-list into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fone</p>
    <ol start="1"><li>two</li></ol>
    <p>three</p>
    <p>four<focus /></p>
    <p>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ol><li>one</li></ol><ol><li>two</li></ol><p>three</p><p>four</p>');
      },
    );
  });

  it('pastes multi-list into a heading', () => {
    const content = `
    <h1>f<focus />oo</h1>
    `;
    const output = `
    <h1>fone</h1>
    <ul><li>two<focus /></li></ul>
    <h1>oo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li>one</li></ul><ul><li>two</li></ul>');
      },
    );
  });

  it('pastes multi-list into a list', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>fone</li></ul>
    <ul><li>two<focus /></li></ul>
    <ul><li>oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li>one</li></ul><ul><li>two</li></ul>');
      },
    );
  });

  it('pastes inline box into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>f<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', `<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>`);
      },
    );
  });

  it('pastes mixed elements into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fone<strong>two</strong></p>
    <h2>three</h2>
    <p>four</p>
    <p>five<focus /></p>
    <p>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', 'one<strong>two</strong><h2>three</h2><p>four</p>five');
      },
    );
  });

  it('pastes div blocks into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fone</p>
    <p style="text-align: center;">two</p>
    <p>three<focus /></p>
    <p>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<div>one</div><div id="test" class="..." style="text-align: center;">two</div>three');
      },
    );
  });

  it('pastes headings containing paragraphs into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fonetwo</p>
    <h2>threefour<focus /></h2>
    <p>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<h1><p>one</p>two</h1><h2><p>three</p><p>four</p></h2>');
      },
    );
  });

  it('pastes blockquotes containing paragraphs into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fonetwo</p>
    <blockquote>threefour<focus /></blockquote>
    <p>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<blockquote><p>one</p><p>two</p></blockquote><blockquote><p>three</p><p>four</p></blockquote>');
      },
    );
  });

  it('pastes lists containing paragraphs into a paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fonetwo</p>
    <ul><li>threefour<focus /></li></ul>
    <p>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li><p>one</p><p>two</p></li></ul><ul><li><p>three</p><p>four</p></li></ul>');
      },
    );
  });

  it('pastes a heading from Chrome into paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <h2>bar<focus /></h2>
    `;
    const clipboardData = `
    <html>
      <body>
        \x3C!--StartFragment--><h2 style="color: rgba(0, 0, 0, 0.88); font-weight: bold; margin: 0px 0px 14px; padding: 0px; font-size: 30px; font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">bar</h2>\x3C!--EndFragment-->
      </body>
    </html>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', clipboardData);
      },
    );
  });

  it('pastes a span from Chrome into paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><span style="color: #000000e0; font-size: 14px; background-color: #ffffff;">foo<focus /></span></p>
    `;
    const clipboardData = `
    <html>
    <body>
      <!--StartFragment--><span style="color: rgba(0, 0, 0, 0.88); font-family: -apple-system, BlinkMacSystemFont, &quot;segoe ui&quot;, Roboto, &quot;helvetica neue&quot;, Arial, &quot;noto sans&quot;, sans-serif, &quot;apple color emoji&quot;, &quot;segoe ui emoji&quot;, &quot;segoe ui symbol&quot;, &quot;noto color emoji&quot;; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">foo</span><!--EndFragment-->
    </body>
    </html>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', clipboardData);
      },
    );
  });

  it('should remove id and class', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p>one</p>
    <p>two<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p id="one">one</p><p class="two">two</p>');
      },
    );
  });

  it('should remove br', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p>foo<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p id="one">foo</p><br />');
      },
    );
  });

  it('should remove div', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p>foo</p>
    <p>bar<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<p>foo</p><div><p>bar</p></div>');
      },
    );
  });

  it('pastes marks with blocks', () => {
    const content = `
    <p>f<focus />oo</p>
    <p>bar</p>
    `;
    const output = `
    <p>f<i>one</i></p>
    <p>two<focus /></p>
    <p>oo</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<i>one</i><p>two</p>');
      },
    );
  });

});
