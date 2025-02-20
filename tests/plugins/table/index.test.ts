import { query } from '@/utils/query';
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
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableColumn"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="delete"]'));
      },
    );
  });

  it('should insert a row above', () => {
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
        <td><p><br /></p></td>
        <td><p><br /></p></td>
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
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableRow"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="insertAbove"]'));
      },
    );
  });

  it('should insert a row below', () => {
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
        <td><p><focus />a2</p></td>
        <td><p>b2</p></td>
      </tr>
      <tr>
        <td><p><br /></p></td>
        <td><p><br /></p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableRow"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="insertBelow"]'));
      },
    );
  });

  it('should delete a row', () => {
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
        <td><p><focus />a1</p></td>
        <td><p>b1</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableRow"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="delete"]'));
      },
    );
  });

  it('should merge cell up', () => {
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
        <td rowspan="2"><p><focus />a1a2</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableMerge"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="up"]'));
      },
    );
  });

  it('should merge cell right', () => {
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
        <td colspan="2"><p><focus />a2b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableMerge"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="right"]'));
      },
    );
  });

  it('should merge cell down', () => {
    const content = `
    <table>
      <tr>
        <td><p><focus />a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p>a2</p></td>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td rowspan="2"><p><focus />a1a2</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p>b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableMerge"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="down"]'));
      },
    );
  });

  it('should merge cell left', () => {
    const content = `
    <table>
      <tr>
        <td><p>a1</p></td>
        <td><p>b1</p></td>
      </tr>
      <tr>
        <td><p>a2</p></td>
        <td><p><focus />b2</p></td>
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
        <td colspan="2"><p><focus />a2b2</p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableMerge"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="left"]'));
      },
    );
  });

  it('should split cell left and right', () => {
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
        <td colspan="2"><p>a1</p></td>
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
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableSplit"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="leftRight"]'));
      },
    );
  });

  it('should split cell top and bottom', () => {
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
        <td><p><focus />a2</p></td>
        <td rowspan="2"><p>b2</p></td>
      </tr>
      <tr>
        <td><p><br /></p></td>
      </tr>
    </table>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="tableSplit"]').closest('.lake-dropdown');
        click(dropdownNode.find('.lake-dropdown-title'));
        click(dropdownNode.find('li[value="topBottom"]'));
      },
    );
  });

  it('should remove a table', () => {
    const content = `
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
    </table>
    <p>bar</p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.event.emit('statechange');
        click(query(document.body).find('.lake-floating-toolbar button[name="remove"]'));
      },
    );
  });

});
