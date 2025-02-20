import { deleteTable } from '@/plugins/table/delete-table';
import { testOperation } from '../../utils';

describe('plugins / table / delete-table', () => {

  it('should delete a table', () => {
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

});
