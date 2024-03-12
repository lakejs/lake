import { expect } from 'chai';
import { testPlugin } from '../utils';

const imageUrl = '../assets/images/heaven-lake-256.png';
const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugin / cut', () => {

  let dataTransfer: DataTransfer;
  let event: ClipboardEvent;

  beforeEach(() => {
    dataTransfer = new DataTransfer();
    event = new ClipboardEvent('cut', {
      clipboardData: dataTransfer,
    });
  });

  it('should cut image box', () => {
    const content = `
    <p>f<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>oo</p>
    `;
    const output = `
    <p>f<focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('cut', event);
        expect(dataTransfer.getData('text/html')).to.equal(`<img src="${imageUrl}" />`);
      },
    );
  });

  it('should cut hr box', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <p><br /><focus /></p>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('cut', event);
        expect(dataTransfer.getData('text/html')).to.equal('<hr />');
      },
    );
  });

  it('should not cut when cursor is in the box', () => {
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
        editor.container.emit('cut', event);
        expect(dataTransfer.getData('text/html')).to.equal('');
      },
    );
  });

  it('should not cut when cusor is at the left strip of the box', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('cut', event);
        expect(dataTransfer.getData('text/html')).to.equal('');
      },
    );
  });

  it('should not cut when cusor is at the right strip of the box', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="right"></lake-box>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('cut', event);
        expect(dataTransfer.getData('text/html')).to.equal('');
      },
    );
  });

});
