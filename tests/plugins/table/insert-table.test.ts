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

});
