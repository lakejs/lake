import { isFirefox, testPlugin } from '../utils';

const imageUrl = '../assets/images/heaven-lake-256.png';
const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / cut', () => {

  let dataTransfer: DataTransfer;
  let event: ClipboardEvent;

  beforeEach(() => {
    dataTransfer = new DataTransfer();
    event = new ClipboardEvent('cut', {
      clipboardData: dataTransfer,
    });
  });

  it('should cut a text (startNode is a text)', () => {
    const content = `
    <p><anchor />f<focus />oo</p>
    `;
    const output = `
    <p><focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('cut', event);
        if (isFirefox) {
          return;
        }
        expect(dataTransfer.getData('text/html')).to.equal('f');
      },
    );
  });

  it('should cut a text (startNode is a block)', () => {
    const content = `
    <anchor /><p>f<focus />oo</p>
    `;
    const output = `
    <p><focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('cut', event);
        if (isFirefox) {
          return;
        }
        expect(dataTransfer.getData('text/html')).to.equal('<p>f</p>');
      },
    );
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
        editor.event.emit('cut', event);
        if (isFirefox) {
          return;
        }
        expect(dataTransfer.getData('text/html')).to.equal(`<img src="${imageUrl}" data-lake-value="${imageBoxValue}" />`);
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
    <p><focus /><br /></p>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('cut', event);
        if (isFirefox) {
          return;
        }
        expect(dataTransfer.getData('text/html')).to.equal('<hr />');
      },
    );
  });

  it('should cut selected content when multiple boxes are selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="video"></lake-box></p>
    <p>bar<lake-box type="inline" name="video"></lake-box></p>
    `;
    const output = `
    <p>foo<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(editor.container.find('lake-box').eq(0).find('.lake-box-strip').eq(0), 0);
        range.setEnd(editor.container.find('lake-box').eq(1).find('.lake-box-strip').eq(1), 0);
        editor.event.emit('cut', event);
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
        editor.event.emit('cut', event);
        expect(dataTransfer.getData('text/html')).to.equal('');
      },
    );
  });

  it('should not cut when cusor is at the start strip of the box', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="start"></lake-box>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('cut', event);
        expect(dataTransfer.getData('text/html')).to.equal('');
      },
    );
  });

  it('should not cut when cusor is at the end strip of the box', () => {
    const content = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>bottom</p>
    `;
    const output = `
    <p>top</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>bottom</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('cut', event);
        expect(dataTransfer.getData('text/html')).to.equal('');
      },
    );
  });

});
