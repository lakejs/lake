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

  it('should adjust the selection when multiple boxes are selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="video"></lake-box></p>
    <p>bar<lake-box type="inline" name="video"></lake-box></p>
    `;
    const output = `
    <p>foo<anchor /><lake-box type="inline" name="video"></lake-box></p>
    <p>bar<lake-box type="inline" name="video"></lake-box><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.setStart(editor.container.find('lake-box').eq(0).find('.lake-box-strip').eq(0), 0);
        range.setEnd(editor.container.find('lake-box').eq(1).find('.lake-box-strip').eq(1), 0);
        editor.event.emit('copy', event);
        expect(range.startNode.name).to.equal('p');
        expect(range.startOffset).to.equal(1);
        expect(range.endNode.name).to.equal('p');
        expect(range.endOffset).to.equal(2);
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
