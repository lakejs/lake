import { insertColumn } from 'lakelib/plugins/table/insert-column';
import { testOperation } from '../../utils';

describe('plugins / table / insert-column', () => {

  it('should insert a column to the left', () => {
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

  it('should insert a column to the right', () => {
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

  it('should insert a column to the left with colspan (1)', () => {
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

  it('should insert a column to the left with colspan (2)', () => {
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

  it('should insert a column to the left with colspan (3)', () => {
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

  it('should insert a column to the right with colspan (1)', () => {
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

  it('should insert a column to the right with colspan (2)', () => {
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

  it('should insert a column to the left with rowspan (1)', () => {
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

  it('should insert a column to the left with rowspan (2)', () => {
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

  it('should insert a column to the right with rowspan (1)', () => {
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

  it('should insert a column to the right with rowspan (2)', () => {
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

  it('should insert a column to the left with colspan and rowspan (1)', () => {
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

  it('should insert a column to the left with colspan and rowspan (2)', () => {
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

  it('should insert a column to the left with colspan and rowspan (3)', () => {
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

  it('should insert a column to the left with colspan and rowspan (4)', () => {
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

  it('should insert a column to the left with colspan and rowspan (5)', () => {
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

  it('should insert a column to the right with colspan and rowspan (1)', () => {
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

  it('should insert a column to the right with colspan and rowspan (2)', () => {
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

  it('should insert a column to the right with colspan and rowspan (3)', () => {
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

  it('should insert a column to the right with colspan and rowspan (4)', () => {
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

  it('should insert a column to the right with colspan and rowspan (5)', () => {
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

  it('should insert a column to the right with colspan and rowspan (6)', () => {
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

});
