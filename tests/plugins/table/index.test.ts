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
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('table');
      },
    );
  });

});
