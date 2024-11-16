import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { deleteContents } from '../../src/operations/delete-contents';

describe('operations / delete-contents', () => {

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

  it('should delete the selected text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
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
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
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
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('should delete part of two blocks', () => {
    const content = `
    <p>foo1<anchor />bar1</p>
    <p>foo2<focus />bar2</p>
    `;
    const output = `
    <p>foo1<focus />bar2</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('should delete text in td', () => {
    const content = `
    <p>foo</p>
    <table><tr><td><anchor />b<focus />ar</td></tr></table>
    `;
    const output = `
    <p>foo</p>
    <table><tr><td><focus />ar</td></tr></table>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('should not delete content when the selection is across two cells', () => {
    const content = `
    <p>foo</p>
    <table><tr><td><anchor />one</td><td><focus />two</td></tr></table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('should not delete content across multi-td', () => {
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
        deleteContents(range);
      },
    );
  });

  it('should delete content before table', () => {
    const content = `
    <p>fo<anchor />o</p>
    <table><tr><td>b<focus />ar</td></tr></table>
    `;
    const output = `
    <p>fo<focus /></p>
    <table><tr><td>bar</td></tr></table>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('should delete content after table', () => {
    const content = `
    <table><tr><td>f<anchor />oo</td></tr></table>
    <p>ba<focus />r</p>
    `;
    const output = `
    <table><tr><td>foo</td></tr></table>
    <p><focus />r</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('should delete table', () => {
    const content = `
    <p>foo1<anchor />bar1</p>
    <table><tr><td>foo</td></tr></table>
    <p>foo2<focus />bar2</p>
    `;
    const output = `
    <p>foo1<focus />bar2</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('the cursor is at the start of the box', () => {
    const content = `
    <lake-box type="block" name="blockBox" focus="start"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox" focus="start"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('the start position of the range is at the start of the box', () => {
    const content = `
    <anchor /><lake-box type="block" name="blockBox"></lake-box>
    <p><focus />foo</p>
    `;
    const output = `
    <p><focus />foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

});
