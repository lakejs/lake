import { insertTable } from 'lakelib/plugins/table/insert-table';
import { testOperation } from '../../utils';

describe('plugins / table / insert-table', () => {

  it('should insert a table', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <table>
      <tr>
        <td><p><focus /><br /></p></td>
        <td><p><br /></p></td>
      </tr>
      <tr>
        <td><p><br /></p></td>
        <td><p><br /></p></td>
      </tr>
      <tr>
        <td><p><br /></p></td>
        <td><p><br /></p></td>
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

});
