import { query } from 'lakelib/utils/query';
import { testPlugin, click } from '../../utils';

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

  it('should fit table to page width', () => {
    const content = `
    <table>
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    const output = `
    <table style="width: 600px;">
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        editor.container.css({
          border: '0',
          padding: '0',
          width: '602px',
        });
        click(query(document.body).find('.lake-floating-toolbar button[name="expand"]'));
      },
    );
  });

  it('should cancel fitting table to page width', () => {
    const content = `
    <table style="width: 600px;">
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        editor.container.css({
          border: '0',
          padding: '0',
          width: '602px',
        });
        click(query(document.body).find('.lake-floating-toolbar button[name="expand"]'));
      },
    );
  });

  it('should set background color', () => {
    const content = `
    <table>
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td style="background-color: #fafafa;"><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        editor.container.css({
          border: '0',
          padding: '0',
          width: '602px',
        });
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="backgroundColor"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-down-icon'));
        click(dropdownNode.find('li[value="#fafafa"]'));
      },
    );
  });

  it('should insert a column to the left', () => {
    const content = `
    <table>
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><p><br /></p></td>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><br /></p></td>
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        editor.container.css({
          border: '0',
          padding: '0',
          width: '602px',
        });
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableColumn"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="insertLeft"]'));
      },
    );
  });

  it('should insert a column to the right', () => {
    const content = `
    <table>
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><p>a1</p></td>
        <td><p><br /></p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />a2</p></td>
        <td><p><br /></p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        editor.container.css({
          border: '0',
          padding: '0',
          width: '602px',
        });
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableColumn"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="insertRight"]'));
      },
    );
  });

  it('should delete a column', () => {
    const content = `
    <table>
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p><focus />b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        editor.container.css({
          border: '0',
          padding: '0',
          width: '602px',
        });
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableColumn"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="delete"]'));
      },
    );
  });

});
