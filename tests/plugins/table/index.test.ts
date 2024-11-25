import { testPlugin } from '../../utils';

describe('plugins / table / index', () => {

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
