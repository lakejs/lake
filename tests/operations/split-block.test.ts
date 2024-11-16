import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { splitBlock } from '../../src/operations/split-block';

describe('operations / split-block', () => {

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
  });

  it('collapsed range: should split a block with a text', () => {
    const content = `
    <p>one<focus />two</p>
    `;
    const output = `
    <p>one</p>
    <p><focus />two</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: should not split a td', () => {
    const content = `
    <table>
      <tr>
        <td>one<focus />two</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: should split a block with a mark (1)', () => {
    const content = `
    <p><strong>one<focus />two</strong></p>
    `;
    const output = `
    <p><strong>one</strong></p>
    <p><strong><focus />two</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: should split a block with a mark (2)', () => {
    const content = `
    <p><strong><focus />foo</strong></p>
    `;
    const output = `
    <p><br /></p>
    <p><strong><focus />foo</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: should split a block with a mark (3)', () => {
    const content = `
    <p><strong>foo<focus /></strong></p>
    `;
    const output = `
    <p><strong>foo</strong></p>
    <p><focus /><br /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('expanded range: should split a block with a text', () => {
    const content = `
    <p>one<anchor />foo<focus />two</p>
    `;
    const output = `
    <p>one</p>
    <p><focus />two</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('expanded range: should split a block with a mark', () => {
    const content = `
    <p><strong>one<anchor />foo<focus />two</strong></p>
    `;
    const output = `
    <p><strong>one</strong></p>
    <p><strong><focus />two</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('expanded range: should split multi-block', () => {
    const content = `
    <p>foo1<anchor />bar1</p>
    <p>foo2<focus />bar2</p>
    `;
    const output = `
    <p>foo1</p>
    <p><focus />bar2</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('expanded range: should not split multi-td', () => {
    const content = `
    <table>
      <tr>
        <td>foo1<anchor />bar1</td>
        <td>foo2<focus />bar2</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: should split a block at the beginning of the text', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <p><br /></p>
    <p><focus />foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: should split a block at the end of the text', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: should split a list with a text', () => {
    const content = `
    <ul><li>one<focus />two</li></ul>
    `;
    const output = `
    <ul><li>one</li></ul>
    <ul><li><focus />two</li></ul>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: the cursor is on the start strip of the inline box', () => {
    const content = `
    <p>one<lake-box type="inline" name="inlineBox" focus="start"></lake-box>two</p>
    `;
    const output = `
    <p>one</p>
    <p><lake-box type="inline" name="inlineBox" focus="start"></lake-box>two</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

  it('collapsed range: the cursor is on the end strip of the inline box', () => {
    const content = `
    <p>one<lake-box type="inline" name="inlineBox" focus="end"></lake-box>two</p>
    `;
    const output = `
    <p>one<lake-box type="inline" name="inlineBox"></lake-box></p>
    <p><focus />two</p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitBlock(range);
      },
    );
  });

});
