import { testOperation, testPlugin } from '../utils';
import {
  insertTable,
  deleteTable,
  insertColumn,
  deleteColumn,
  insertRow,
  deleteRow,
} from '../../src/plugins/table';

describe('plugins / table (functions)', () => {

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
    testOperation(
      content,
      output,
      range => {
        insertTable(range, 3, 2);
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
    testOperation(
      content,
      output,
      range => {
        deleteTable(range);
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
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'left');
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
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'right');
      },
    );
  });

  it('insertColumn: should insert a column to the left with colspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><focus />c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><br /></td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><br /></td>
        <td><focus />c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td><br /></td>
        <td>c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'left');
      },
    );
  });

  it('insertColumn: should insert a column to the left with colspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><focus />c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><br /></td>
        <td><focus />c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><br /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td><br /></td>
        <td>c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'left');
      },
    );
  });

  it('insertColumn: should insert a column to the right with colspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2"><focus />a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><br /></td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2"><focus />a2</td>
        <td><br /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td><br /></td>
        <td>c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'right');
      },
    );
  });

  it('insertColumn: should insert a column to the right with colspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><focus />c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td><br /></td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><focus />c2</td>
        <td><br /></td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td>c3</td>
        <td><br /></td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'right');
      },
    );
  });

  it('insertColumn: should insert a column to the left with rowspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2">b2<focus /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td><br /></td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td><br /></td>
        <td rowspan="2">b2<focus /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td><br /></td>
        <td>c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'left');
      },
    );
  });

  it('insertColumn: should insert a column to the left with rowspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2">b2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td><focus />c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><br /></td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2">b2</td>
        <td><br /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td><br /></td>
        <td><focus />c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'left');
      },
    );
  });

  it('insertColumn: should insert a column to the right with rowspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2">b2<focus /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><br /></td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2">b2<focus /></td>
        <td><br /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td><br /></td>
        <td>c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'right');
      },
    );
  });

  it('insertColumn: should insert a column to the right with rowspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2">b2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td><br /></td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2">b2</td>
        <td><br /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td><br /></td>
        <td>c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'right');
      },
    );
  });

  it('insertColumn: should insert a column to the left with colspan and rowspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td><focus />c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><br /></td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td><br /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td><br /></td>
        <td>c3</td>
      </tr>
      <tr>
        <td><br /></td>
        <td><focus />c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td><br /></td>
        <td>c5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'left');
      },
    );
  });

  it('insertColumn: should insert a column to the left with colspan and rowspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td><br /></td>
        <td><focus />b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="3" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td><br /></td>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'left');
      },
    );
  });

  it('insertColumn: should insert a column to the right with colspan and rowspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3"><focus />a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><br /></td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3"><focus />a2</td>
        <td><br /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td><br /></td>
        <td>c3</td>
      </tr>
      <tr>
        <td><br /></td>
        <td>c4</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'right');
      },
    );
  });

  it('insertColumn: should insert a column to the right with colspan and rowspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td><br /></td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="3" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td><br /></td>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'right');
      },
    );
  });

  it('insertColumn: should insert a column to the right with colspan and rowspan (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td><br /></td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td><br /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td><br /></td>
        <td>c3</td>
      </tr>
      <tr>
        <td><br /></td>
        <td>c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td><br /></td>
        <td>c5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertColumn(range, 'right');
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
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
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
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
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
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
      },
    );
  });

  it('deleteColumn: should delete a column with colspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><focus />c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td>c3</td>
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
        <td colspan="2">a2<focus /></td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
      },
    );
  });

  it('deleteColumn: should delete a column with colspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><focus />c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1<focus /></td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
      },
    );
  });

  it('deleteColumn: should delete a column with rowspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2">b2<focus /></td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>c2<focus /></td>
      </tr>
      <tr>
        <td>a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
      },
    );
  });

  it('deleteColumn: should delete a column with rowspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2">b2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>c1<focus /></td>
      </tr>
      <tr>
        <td>a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
      },
    );
  });

  it('deleteColumn: should delete a column with colspan and rowspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3"><focus />a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td rowspan="3"><focus />a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
      },
    );
  });

  it('deleteColumn: should delete a column with colspan and rowspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>b1<focus /></td>
        <td>c1</td>
      </tr>
      <tr>
        <td rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
      <tr>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
      },
    );
  });

  it('deleteColumn: should delete a column with colspan and rowspan (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>c1<focus /></td>
      </tr>
      <tr>
        <td rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>c4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteColumn(range);
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
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'above');
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
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'below');
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
    testOperation(
      content,
      output,
      range => {
        deleteRow(range);
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
    testOperation(
      content,
      output,
      range => {
        deleteRow(range);
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
    testOperation(
      content,
      output,
      range => {
        deleteRow(range);
      },
    );
  });

});

describe('plugins / table (main)', () => {

  it('should insert a table', () => {
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
