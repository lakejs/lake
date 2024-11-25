import { deleteRow } from 'lakelib/plugins/table/delete-row';
import { testOperation } from '../../utils';

describe('plugins / table / delete-row', () => {

  it('should delete the first row', () => {
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

  it('should delete the last row', () => {
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

  it('should delete the table when there is only one row', () => {
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

  it('should delete a row with colspan (1)', () => {
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

  it('should delete a row with colspan (2)', () => {
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

  it('should delete a row with rowspan (1)', () => {
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

  it('should delete a row with rowspan (2)', () => {
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

  it('should delete a row with colspan and rowspan (1)', () => {
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

  it('should delete a row with colspan and rowspan (2)', () => {
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

  it('should delete a row with colspan and rowspan (3)', () => {
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

});
