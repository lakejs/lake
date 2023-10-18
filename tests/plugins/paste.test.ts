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

});
