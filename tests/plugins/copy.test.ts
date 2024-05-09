import { testPlugin } from '../utils';

describe('plugins / copy', () => {

  let dataTransfer: DataTransfer;
  let event: ClipboardEvent;

  beforeEach(() => {
    dataTransfer = new DataTransfer();
    event = new ClipboardEvent('copy', {
      clipboardData: dataTransfer,
    });
  });

  it('should copy HTML string from hr box', () => {
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
        editor.event.emit('copy', event);
        expect(dataTransfer.getData('text/html')).to.equal('<hr />');
      },
    );
  });

  it('should not copy when cursor is in the box', () => {
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
        editor.event.emit('copy', event);
        expect(dataTransfer.getData('text/html')).to.equal('');
      },
    );
  });

  it('should not copy when cusor is at the start strip of the box', () => {
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
        editor.event.emit('copy', event);
        expect(dataTransfer.getData('text/html')).to.equal('');
      },
    );
  });

  it('should not copy when cusor is at the end strip of the box', () => {
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
        editor.event.emit('copy', event);
        expect(dataTransfer.getData('text/html')).to.equal('');
      },
    );
  });

});
