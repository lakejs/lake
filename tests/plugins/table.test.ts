import { testOperation, testPlugin } from '../utils';
import {
  getTableMap,
  insertTable,
  deleteTable,
  insertColumn,
  deleteColumn,
  insertRow,
  deleteRow,
  mergeCells,
  splitCell,
} from '../../src/plugins/table';

describe('plugins / table (functions)', () => {

  it('getTableMap: should return correct map', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td rowspan="3">d1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td><focus />c3</td>
      </tr>
      <tr>
        <td>c4</td>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        const tableNode = range.startNode.closest('table');
        const table = tableNode.get(0) as HTMLTableElement;
        const tableMap = getTableMap(table);
        expect(tableMap[0][0].innerText).to.equal('a1');
        expect(tableMap[0][1].innerText).to.equal('b1');
        expect(tableMap[0][2].innerText).to.equal('c1');
        expect(tableMap[0][3].innerText).to.equal('d1');
        expect(tableMap[1][0].innerText).to.equal('a2');
        expect(tableMap[1][1].innerText).to.equal('a2');
        expect(tableMap[1][2].innerText).to.equal('c2');
        expect(tableMap[1][3].innerText).to.equal('d1');
        expect(tableMap[2][0].innerText).to.equal('a2');
        expect(tableMap[2][1].innerText).to.equal('a2');
        expect(tableMap[2][2].innerText).to.equal('c3');
        expect(tableMap[2][3].innerText).to.equal('d1');
        expect(tableMap[3][0].innerText).to.equal('a2');
        expect(tableMap[3][1].innerText).to.equal('a2');
        expect(tableMap[3][2].innerText).to.equal('c4');
        expect(tableMap[3][3].innerText).to.equal('d4');
        expect(tableMap[4][0].innerText).to.equal('a5');
        expect(tableMap[4][1].innerText).to.equal('b5');
        expect(tableMap[4][2].innerText).to.equal('c5');
        expect(tableMap[4][3].innerText).to.equal('d5');
      },
    );
  });

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

  it('insertColumn: should insert a column to the left with colspan (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td colspan="2"><focus />c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td colspan="2">c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td colspan="2">c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><br /></td>
        <td colspan="2"><focus />c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td><br /></td>
        <td colspan="2">c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td><br /></td>
        <td colspan="2">c3</td>
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
        <td rowspan="2"><focus />b2</td>
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
        <td rowspan="2"><focus />b2</td>
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
        <td rowspan="2"><focus />b2</td>
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
        <td rowspan="2"><focus />b2</td>
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

  it('insertColumn: should insert a column to the left with colspan and rowspan (3)', () => {
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
        <td><br /></td>
        <td><focus />a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td><br /></td>
        <td colspan="2" rowspan="3">a2</td>
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
        <td><br /></td>
        <td>a5</td>
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

  it('insertColumn: should insert a column to the left with colspan and rowspan (4)', () => {
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
        <td><br /></td>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td><br /></td>
        <td colspan="2" rowspan="3"><focus />a2</td>
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
        <td><br /></td>
        <td>a5</td>
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

  it('insertColumn: should insert a column to the left with colspan and rowspan (5)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td>c1</td>
        <td>d1</td>
      </tr>
      <tr>
        <td colspan="3" rowspan="3">a2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td>d3</td>
      </tr>
      <tr>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
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
        <td>d1</td>
      </tr>
      <tr>
        <td colspan="4" rowspan="3">a2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td>d3</td>
      </tr>
      <tr>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td><br /></td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
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

  it('insertColumn: should insert a column to the right with colspan and rowspan (4)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2"><focus />c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2"><focus />c1</td>
        <td><br /></td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><br /></td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td><br /></td>
        <td>d3</td>
        <td>e3</td>
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

  it('insertColumn: should insert a column to the right with colspan and rowspan (5)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td colspan="2" rowspan="3"><focus />b2</td>
      </tr>
      <tr>
        <td>a3</td>
      </tr>
      <tr>
        <td>a4</td>
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
        <td>a2</td>
        <td colspan="2" rowspan="3"><focus />b2</td>
        <td><br /></td>
      </tr>
      <tr>
        <td>a3</td>
        <td><br /></td>
      </tr>
      <tr>
        <td>a4</td>
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

  it('insertColumn: should insert a column to the right with colspan and rowspan (6)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2"><focus />a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><br /></td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2"><focus />a2</td>
        <td><br /></td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td><br /></td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
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
        <td><focus />b1</td>
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
        <td colspan="2"><focus />a2</td>
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
        <td><focus />b1</td>
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
        <td rowspan="2"><focus />b2</td>
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
        <td><focus />c2</td>
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
        <td><focus />c1</td>
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
        <td>b1</td>
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
        <td><focus />b1</td>
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
        <td><focus />c1</td>
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

  it('deleteColumn: should delete a column with colspan and rowspan (4)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td rowspan="2"><focus />c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
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

  it('deleteColumn: should delete a column with colspan and rowspan (5)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td><focus />d1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td colspan="2" rowspan="3">b2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>d3</td>
      </tr>
      <tr>
        <td>a4</td>
        <td>d4</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td><focus />c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td colspan="2" rowspan="3">b2</td>
      </tr>
      <tr>
        <td>a3</td>
      </tr>
      <tr>
        <td>a4</td>
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
        insertRow(range, 'up');
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
        insertRow(range, 'down');
      },
    );
  });

  it('insertRow: should insert a row above with colspan (1)', () => {
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
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2"><br /></td>
        <td><br /></td>
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
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'up');
      },
    );
  });

  it('insertRow: should insert a row above with colspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td><focus />c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2"><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td><focus />c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'up');
      },
    );
  });

  it('insertRow: should insert a row below with colspan (1)', () => {
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
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2"><focus />a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2"><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'down');
      },
    );
  });

  it('insertRow: should insert a row below with colspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td><focus />c3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td><focus />c3</td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
        <td><br /></td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'down');
      },
    );
  });

  it('insertRow: should insert a row above with rowspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2"><focus />b2</td>
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
        <td>c1</td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2"><focus />b2</td>
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
        insertRow(range, 'up');
      },
    );
  });

  it('insertRow: should insert a row above with rowspan (2)', () => {
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
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="3">b2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td>a3</td>
        <td><focus />c3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'up');
      },
    );
  });

  it('insertRow: should insert a row below with rowspan (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2"><focus />b2</td>
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
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="3"><focus />b2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
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
        insertRow(range, 'down');
      },
    );
  });

  it('insertRow: should insert a row below with rowspan (2)', () => {
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
      <tr>
        <td><br /></td>
        <td><br /></td>
        <td><br /></td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'down');
      },
    );
  });

  it('insertRow: should insert a row above with colspan and rowspan (1)', () => {
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
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2"><br /></td>
        <td><br /></td>
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
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'up');
      },
    );
  });

  it('insertRow: should insert a row above with colspan and rowspan (2)', () => {
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
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="4">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td><br /></td>
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
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'up');
      },
    );
  });

  it('insertRow: should insert a row above with colspan and rowspan (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td><focus />d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><br /></td>
        <td><br /></td>
        <td><br /></td>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td><focus />d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'up');
      },
    );
  });

  it('insertRow: should insert a row above with colspan and rowspan (4)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td>c2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td><focus />c3</td>
        <td>d3</td>
      </tr>
      <tr>
        <td>c4</td>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="4">a2</td>
        <td>c2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td><focus />c3</td>
        <td>d3</td>
      </tr>
      <tr>
        <td>c4</td>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'up');
      },
    );
  });

  it('insertRow: should insert a row below with colspan and rowspan (1)', () => {
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
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="4"><focus />a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td><br /></td>
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
        insertRow(range, 'down');
      },
    );
  });

  it('insertRow: should insert a row below with colspan and rowspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="3">a2</td>
        <td><focus />c2</td>
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
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="4">a2</td>
        <td><focus />c2</td>
      </tr>
      <tr>
        <td><br /></td>
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
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'down');
      },
    );
  });

  it('insertRow: should insert a row below with colspan and rowspan (3)', () => {
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
        <td><focus />c3</td>
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
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="4">a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td><focus />c3</td>
      </tr>
      <tr>
        <td><br /></td>
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
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'down');
      },
    );
  });

  it('insertRow: should insert a row below with colspan and rowspan (4)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><focus />d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><focus />d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td><br /></td>
        <td><br /></td>
        <td><br /></td>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'down');
      },
    );
  });

  it('insertRow: should insert a row below with colspan and rowspan (5)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td><focus />d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="3">c1</td>
        <td><focus />d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2"><br /></td>
        <td><br /></td>
        <td><br /></td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        insertRow(range, 'down');
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
        <td><focus />a2</td>
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
        <td><focus />a2</td>
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

  it('deleteRow: should delete a row with colspan (1)', () => {
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
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td><focus />c3</td>
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

  it('deleteRow: should delete a row with colspan (2)', () => {
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
        <td colspan="2">a2</td>
        <td><focus />c2</td>
      </tr>
      <tr>
        <td colspan="2">a3</td>
        <td>c3</td>
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

  it('deleteRow: should delete a row with rowspan (1)', () => {
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
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td><focus />c2</td>
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

  it('deleteRow: should delete a row with rowspan (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td rowspan="2"><focus />b2</td>
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
        <td>c1</td>
      </tr>
      <tr>
        <td>a3</td>
        <td><focus />b2</td>
        <td>c3</td>
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

  it('deleteRow: should delete a row with colspan and rowspan (1)', () => {
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
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="2"><focus />a2</td>
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
        deleteRow(range);
      },
    );
  });

  it('deleteRow: should delete a row with colspan and rowspan (2)', () => {
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
        <td><focus />c3</td>
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
        <td>b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="2">a2</td>
        <td>c2</td>
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
    testOperation(
      content,
      output,
      range => {
        deleteRow(range);
      },
    );
  });

  it('deleteRow: should delete a row with colspan and rowspan (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td><focus />e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td colspan="2">a2</td>
        <td>c1</td>
        <td>d2</td>
        <td><focus />e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
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

  it('mergeCells: should merge cell up (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td><focus />e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td rowspan="2"><focus />e1e2</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'up');
      },
    );
  });

  it('mergeCells: should merge cell up (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'up');
      },
    );
  });

  it('mergeCells: should merge cell up (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td><focus />b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'up');
      },
    );
  });

  it('mergeCells: should merge cell up (4)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td><focus />c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="3"><focus />c1c3</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'up');
      },
    );
  });

  it('mergeCells: should merge cell right (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td><focus />d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td colspan="2"><focus />d2e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'right');
      },
    );
  });

  it('mergeCells: should merge cell right (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td><focus />e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'right');
      },
    );
  });

  it('mergeCells: should merge cell right (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td><focus />b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'right');
      },
    );
  });

  it('mergeCells: should merge cell right (4)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td rowspan="2">b1</td>
        <td>c1</td>
      </tr>
      <tr>
        <td><focus />a2</td>
        <td>c2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'right');
      },
    );
  });

  it('mergeCells: should merge cell down (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td><focus />e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td rowspan="2"><focus />e1e2</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'down');
      },
    );
  });

  it('mergeCells: should merge cell down (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td><focus />b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'down');
      },
    );
  });

  it('mergeCells: should merge cell down (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2"><focus />a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'down');
      },
    );
  });

  it('mergeCells: should merge cell left (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td><focus />e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td colspan="2"><focus />d2e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'left');
      },
    );
  });

  it('mergeCells: should merge cell left (2)', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'left');
      },
    );
  });

  it('mergeCells: should merge cell left (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2"><focus />c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = content;
    testOperation(
      content,
      output,
      range => {
        mergeCells(range, 'left');
      },
    );
  });

  it('splitCell: should split a cell horizontally (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td><focus />c2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td rowspan="2">a2</td>
        <td rowspan="2">b2</td>
        <td><focus />c2</td>
        <td rowspan="2">d2</td>
        <td rowspan="2">e2</td>
      </tr>
      <tr>
        <td><br /></td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'horizontal');
      },
    );
  });

  it('splitCell: should split a cell horizontally (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td rowspan="2">a2</td>
        <td rowspan="2">b2</td>
        <td><focus />c2</td>
        <td rowspan="2">d2</td>
        <td rowspan="2">e2</td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>a4</td>
        <td>b4</td>
        <td>c4</td>
        <td>d4</td>
        <td>e4</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td rowspan="3">a2</td>
        <td rowspan="3">b2</td>
        <td><focus />c2</td>
        <td rowspan="3">d2</td>
        <td rowspan="3">e2</td>
      </tr>
      <tr>
        <td><br /></td>
      </tr>
      <tr>
        <td>c3</td>
      </tr>
      <tr>
        <td>a4</td>
        <td>b4</td>
        <td>c4</td>
        <td>d4</td>
        <td>e4</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'horizontal');
      },
    );
  });

  it('splitCell: should split a cell horizontally (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td rowspan="2">a2</td>
        <td rowspan="2">b2</td>
        <td>c2</td>
        <td rowspan="2">d2</td>
        <td rowspan="2">e2</td>
      </tr>
      <tr>
        <td><focus />c3</td>
      </tr>
      <tr>
        <td>a4</td>
        <td>b4</td>
        <td>c4</td>
        <td>d4</td>
        <td>e4</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td rowspan="3">a2</td>
        <td rowspan="3">b2</td>
        <td>c2</td>
        <td rowspan="3">d2</td>
        <td rowspan="3">e2</td>
      </tr>
      <tr>
        <td><focus />c3</td>
      </tr>
      <tr>
        <td><br /></td>
      </tr>
      <tr>
        <td>a4</td>
        <td>b4</td>
        <td>c4</td>
        <td>d4</td>
        <td>e4</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'horizontal');
      },
    );
  });

  it('splitCell: should split a cell horizontally (4)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2"><focus />a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="3">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2"><focus />a2</td>
        <td rowspan="2">d2</td>
        <td rowspan="2">e2</td>
      </tr>
      <tr>
        <td colspan="2"><br /></td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'horizontal');
      },
    );
  });

  it('splitCell: should split a cell horizontally (5)', () => {
    const content = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><focus />a1</td>
        <td rowspan="2">b1</td>
        <td rowspan="3">c1</td>
        <td rowspan="2">d1</td>
        <td rowspan="2">e1</td>
      </tr>
      <tr>
        <td><br /></td>
      </tr>
      <tr>
        <td colspan="2">a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'horizontal');
      },
    );
  });

  it('splitCell: should split a cell horizontally (6)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
      </tr>
      <tr>
        <td colspan="3" rowspan="3"><focus />a2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td>d3</td>
      </tr>
      <tr>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
      </tr>
      <tr>
        <td colspan="3"><focus />a2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td colspan="3" rowspan="2"><br /></td>
        <td>d3</td>
      </tr>
      <tr>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'horizontal');
      },
    );
  });

  it('splitCell: should split a cell horizontally (7)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
      </tr>
      <tr>
        <td rowspan="3">a2</td>
        <td rowspan="3" colspan="2"><focus />b2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td>d3</td>
      </tr>
      <tr>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
      </tr>
      <tr>
        <td rowspan="3">a2</td>
        <td colspan="2"><focus />b2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td colspan="2" rowspan="2"><br /></td>
        <td>d3</td>
      </tr>
      <tr>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'horizontal');
      },
    );
  });

  it('splitCell: should split a cell vertically (1)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td><focus />c2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td colspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td><focus />c2</td>
        <td><br /></td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td colspan="2">c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'vertical');
      },
    );
  });

  it('splitCell: should split a cell vertically (2)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td colspan="2">c1</td>
        <td>e1</td>
        <td>f1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td><focus />c2</td>
        <td>d2</td>
        <td>e2</td>
        <td>f2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td colspan="2">c3</td>
        <td>e3</td>
        <td>f3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td colspan="3">c1</td>
        <td>e1</td>
        <td>f1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td><focus />c2</td>
        <td><br /></td>
        <td>d2</td>
        <td>e2</td>
        <td>f2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td colspan="3">c3</td>
        <td>e3</td>
        <td>f3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'vertical');
      },
    );
  });

  it('splitCell: should split a cell vertically (3)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td colspan="3">c1</td>
        <td>f1</td>
        <td>g1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td>c2</td>
        <td>d2</td>
        <td>e2</td>
        <td>f2</td>
        <td>g2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td colspan="3"><focus />c3</td>
        <td>f3</td>
        <td>g3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td colspan="3">c1</td>
        <td>f1</td>
        <td>g1</td>
      </tr>
      <tr>
        <td>a2</td>
        <td>b2</td>
        <td>c2</td>
        <td>d2</td>
        <td>e2</td>
        <td>f2</td>
        <td>g2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td><focus />c3</td>
        <td colspan="2"><br /></td>
        <td>f3</td>
        <td>g3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'vertical');
      },
    );
  });

  it('splitCell: should split a cell vertically (4)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td colspan="2"><focus />a2</td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td rowspan="2">c1</td>
        <td>d1</td>
        <td>e1</td>
      </tr>
      <tr>
        <td><focus />a2</td>
        <td><br /></td>
        <td>d2</td>
        <td>e2</td>
      </tr>
      <tr>
        <td>a3</td>
        <td>b3</td>
        <td>c3</td>
        <td>d3</td>
        <td>e3</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'vertical');
      },
    );
  });

  it('splitCell: should split a cell vertically (5)', () => {
    const content = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
      </tr>
      <tr>
        <td colspan="3" rowspan="3"><focus />a2</td>
        <td>d2</td>
      </tr>
      <tr>
        <td>d3</td>
      </tr>
      <tr>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>a1</td>
        <td>b1</td>
        <td>c1</td>
        <td>d1</td>
      </tr>
      <tr>
        <td rowspan="3"><focus />a2</td>
        <td rowspan="3" colspan="2"><br /></td>
        <td>d2</td>
      </tr>
      <tr>
        <td>d3</td>
      </tr>
      <tr>
        <td>d4</td>
      </tr>
      <tr>
        <td>a5</td>
        <td>b5</td>
        <td>c5</td>
        <td>d5</td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        splitCell(range, 'vertical');
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
