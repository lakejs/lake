import { splitCell } from 'lakelib/plugins/table/split-cell';
import { testOperation } from '../../utils';

describe('plugins / table / split-cell', () => {

  it('should split a cell horizontally (1)', () => {
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

  it('should split a cell horizontally (2)', () => {
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

  it('should split a cell horizontally (3)', () => {
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

  it('should split a cell horizontally (4)', () => {
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

  it('should split a cell horizontally (5)', () => {
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

  it('should split a cell horizontally (6)', () => {
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

  it('should split a cell horizontally (7)', () => {
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

  it('should split a cell vertically (1)', () => {
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

  it('should split a cell vertically (2)', () => {
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

  it('should split a cell vertically (3)', () => {
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

  it('should split a cell vertically (4)', () => {
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

  it('should split a cell vertically (5)', () => {
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
