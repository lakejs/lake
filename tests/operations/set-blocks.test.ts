import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { setBlocks } from '../../src/operations/set-blocks';

describe('operations / set-blocks', () => {

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
  });

  it('no text is selected', () => {
    const content = `
    <p>outer start</p>
    <p>foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h1>foo<strong>bold</strong><focus /></h1>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h1 />');
      },
    );
  });

  it('after selecting the content of a block', () => {
    const content = `
    <p>outer start</p>
    <p><anchor />foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h1><anchor />foo<strong>bold</strong><focus /></h1>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h1 />');
      },
    );
  });

  it('should add styles by passing through a string value', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <p style="text-align: center;">f<anchor />oo<strong>bold</strong></p>
    <p style="text-align: center;"><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<p style="text-align: center;"></p>');
      },
    );
  });

  it('should add styles by passing through an object value', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <p style="text-align: center;">f<anchor />oo<strong>bold</strong></p>
    <p style="text-align: center;"><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, {
          'text-align': 'center',
        });
      },
    );
  });

  it('should set multiple blocks', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <h1>heading</h1>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h2>f<anchor />oo<strong>bold</strong></h2>
    <h2>heading</h2>
    <h2><i>itelic</i>ba<focus />r</h2>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h2></h2>');
      },
    );
  });

  it('should create a block when there is no content', () => {
    const content = `
    <focus />
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<p />');
      },
    );
  });

  it('should create a block when there is a br', () => {
    const content = `
    <focus /><br />
    `;
    const output = `
    <p><focus /><br /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<p />');
      },
    );
  });

  it('should create a block when the selected content are not in a block', () => {
    const content = `
    foo<strong>bar<focus /></strong><lake-box type="inline" name="inlineBox"></lake-box>cat
    `;
    const output = `
    <h2>foo<strong>bar<focus /></strong><lake-box type="inline" name="inlineBox"></lake-box>cat</h2>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h2 />');
      },
    );
  });

  it('should create a block when there is only a text', () => {
    const content = `
    foo<focus />bar
    `;
    const output = `
    <p>foo<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<p />');
      },
    );
  });

  it('should create a block among other blocks', () => {
    const content = `
    <p>outer start</p>
    foo<strong>bar<focus /></strong>end
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h2>foo<strong>bar<focus /></strong>end</h2>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h2 />');
      },
    );
  });

  it('should create a block in the table', () => {
    const content = `
    <table>
      <tr>
        <td>foo<focus /></td>
      </tr>
    </table>
    `;
    const output = `
    <table>
      <tr>
        <td>
          <p>foo<focus /></p>
        </td>
      </tr>
    </table>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<p />');
      },
    );
  });

  it('should set a nested block when no text is selected', () => {
    const content = `
    <p>outer start</p>
    <blockquote><p>foo<strong>bold</strong><focus /></p></blockquote>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <blockquote><ul><li>foo<strong>bold</strong><focus /></li></ul></blockquote>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ul><li></li></ul>');
      },
    );
  });

  it('should set blockquotes after selecting multiple blocks', () => {
    const content = `
    <p>outer start</p>
    <blockquote><p><anchor />foo1<strong>bold1</strong></p></blockquote>
    <blockquote><p>foo2<strong>bold2</strong><focus /></p></blockquote>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <blockquote type="error"><p><anchor />foo1<strong>bold1</strong></p></blockquote>
    <blockquote type="error"><p>foo2<strong>bold2</strong><focus /></p></blockquote>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<blockquote type="error" />');
      },
    );
  });

  it('should create a list when there is no block', () => {
    const content = `
    foo<focus />bar
    `;
    const output = `
    <ol start="1"><li>foo<focus />bar</li></ol>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ol><li></li></ol>');
      },
    );
  });

  it('should change a block to a list', () => {
    const content = `
    <p>outer start</p>
    <p>foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <ol start="1"><li>foo<strong>bold</strong><focus /></li></ol>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ol><li></li></ol>');
      },
    );
  });

  it('should change a list to another list', () => {
    const content = `
    <p>outer start</p>
    <ul><li>foo<strong>bold</strong><focus /></li></ul>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <ol start="1"><li>foo<strong>bold</strong><focus /></li></ol>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ol><li></li></ol>');
      },
    );
  });

  it('should change a list to a heading', () => {
    const content = `
    <p>outer start</p>
    <ul><li>foo<strong>bold</strong><focus /></li></ul>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <h1>foo<strong>bold</strong><focus /></h1>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h1 />');
      },
    );
  });

  it('should remove indent when changing a list to a paragraph', () => {
    const content = `
    <p>outer start</p>
    <ul indent="1"><li>foo<strong>bold</strong><focus /></li></ul>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <p>foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<p />');
      },
    );
  });

  it('should change multi-block to a list', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <h1>heading</h1>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <ol start="1"><li>f<anchor />oo<strong>bold</strong></li></ol>
    <ol start="2"><li>heading</li></ol>
    <ol start="3"><li><i>itelic</i>ba<focus />r</li></ol>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ol><li></li></ol>');
      },
    );
  });

  it('the cursor is at the end of the box', () => {
    const content = `
    <lake-box type="block" name="blockBox" focus="end"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox" focus="end"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<h2 />');
      },
    );
  });

  it('should change multi-block with box to a list', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <lake-box type="block" name="blockBox"></lake-box>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const output = `
    <p>outer start</p>
    <ol start="1"><li>f<anchor />oo<strong>bold</strong></li></ol>
    <lake-box type="block" name="blockBox"></lake-box>
    <ol start="1"><li><i>itelic</i>ba<focus />r</li></ol>
    <p>outer end</p>
    `;
    testOperation(
      content,
      output,
      range => {
        setBlocks(range, '<ol><li></li></ol>');
      },
    );
  });

});
