import Editor from '../../src';
import { testPlugin } from '../utils';

function pasteData(editor: Editor, format: string, data: string) {
  const event = new ClipboardEvent('paste', {
    clipboardData: new DataTransfer(),
  });
  event.clipboardData?.setData(format, data);
  editor.container.emit('paste', event);
}

describe('paste plugin', () => {

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

  it('pastes plain text into paragraph', () => {
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

  it('pastes HTML as plain text into paragraph', () => {
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

  it('pastes plain text into heading', () => {
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

  it('pastes plain text into list', () => {
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

  it('pastes multi-line plain text into paragraph', () => {
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

  it('pastes multi-line plain text into heading', () => {
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

  it('pastes multi-line plain text into list', () => {
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

  it('pastes a paragraph into paragraph', () => {
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

  it('pastes a paragraph into heading', () => {
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

  it('pastes a paragraph into list', () => {
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

  it('pastes multi-paragraph into paragraph', () => {
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

  it('pastes multi-pragraph into heading', () => {
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

  it('pastes multi-pragraph into list', () => {
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

  it('pastes a list into paragraph', () => {
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

  it('pastes a list into heading', () => {
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

  it('pastes a list into list', () => {
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

  it('pastes multi-list into paragraph', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>fone</p>
    <ul><li>two<focus /></li></ul>
    <p>oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        pasteData(editor, 'text/html', '<ul><li>one</li></ul><ul><li>two</li></ul>');
      },
    );
  });

  it('pastes multi-list into heading', () => {
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

  it('pastes multi-list into list', () => {
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

});
