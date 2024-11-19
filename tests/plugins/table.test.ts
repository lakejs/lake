import { testPlugin } from '../utils';
import { insertColumn, deleteColumn, insertTable, deleteTable, insertRow, deleteRow } from '../../src/plugins/table';

describe('plugins / table', () => {

  it('insertTable: should insert a table', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <table>
      <tr>
        <td><focus /><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
      </tr>
    </table>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        insertTable(editor.selection.range, 3, 2);
      },
    );
  });

  it('deleteTable: should delete a table', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
      </tr>
      <tr>
        <td>a2</td>
      </tr>
      <tr>
        <td>a3</td>
      </tr>
    </table>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        deleteTable(editor.selection.range);
      },
    );
  });

  it('insertColumn: should insert a column to the left', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><br /></td>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td><br /></td>
        <td>a2</td>
        <td>b2</td>
      </tr>
      <tr>
        <td><br /></td>
        <td>a3</td>
        <td>b3</td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        insertColumn(editor.selection.range, 'left');
      },
    );
  });

  it('insertColumn: should insert a column to the right', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td><br /></td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td><br /></td>
        <td>b2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td><br /></td>
        <td>b3</td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        insertColumn(editor.selection.range, 'right');
      },
    );
  });

  it('deleteColumn: should delete the first column', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>b1<focus /></td>
      </tr>
      <tr>
        <td>b2</td>
      </tr>
      <tr>
        <td>b3</td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        deleteColumn(editor.selection.range);
      },
    );
  });

  it('deleteColumn: should delete the last column', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1<focus /></td>
      </tr>
      <tr>
        <td>a2</td>
      </tr>
      <tr>
        <td>a3</td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        deleteColumn(editor.selection.range);
      },
    );
  });

  it('deleteColumn: should delete the table when there is only one column', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
      </tr>
      <tr>
        <td>a2</td>
      </tr>
      <tr>
        <td>a3</td>
      </tr>
    </table>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        deleteColumn(editor.selection.range);
      },
    );
  });

  it('insertRow: should insert a row above', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        insertRow(editor.selection.range, 'above');
      },
    );
  });

  it('insertRow: should insert a row below', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        insertRow(editor.selection.range, 'below');
      },
    );
  });

  it('deleteRow: should delete the first row', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a2<focus /></td>
        <td>b2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        deleteRow(editor.selection.range);
      },
    );
  });

  it('deleteRow: should delete the last row', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
      </tr>
      <tr>
        <td><focus />a3</td>
        <td>b3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
      </tr>
      <tr>
        <td>a2<focus /></td>
        <td>b2</td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        deleteRow(editor.selection.range);
      },
    );
  });

  it('deleteRow: should delete the table when there is only one row', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
      </tr>
    </table>
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        deleteRow(editor.selection.range);
      },
    );
  });

  it('command: should insert a table', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <table>
      <tr>
        <td><focus /><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
      </tr>
    </table>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('table');
      },
    );
  });

});
