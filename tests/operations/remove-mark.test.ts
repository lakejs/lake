import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { removeMark } from '../../src/operations/remove-mark';

describe('operations / remove-mark', () => {

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

  it('removes an empty mark', () => {
    const content = `
    <p>foo<strong>\u200B<focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('removes a mark when the focus is at the end of the text', () => {
    const content = `
    <p>foo<strong>bold<focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<strong>bold</strong>\u200B<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: no target mark', () => {
    const content = `
    <p>foo<strong>\u200B<focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<strong>\u200B<focus /></strong>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<em />');
      },
    );
  });

  it('expanded range: removes a mark with selecting mark', () => {
    const content = `
    <p>foo<anchor /><strong>bold</strong><focus />bar</p>
    `;
    const output = `
    <p>foo<anchor />bold<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: no target mark', () => {
    const content = `
    <p>foo<anchor /><strong>bold</strong><focus />bar</p>
    `;
    const output = `
    <p>foo<anchor /><strong>bold</strong><focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<em />');
      },
    );
  });

  it('expanded range: no block', () => {
    const content = `
    <anchor /><strong>foo</strong><focus />
    `;
    const output = `
    <anchor />foo<focus />
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: removes a mark with selecting text', () => {
    const content = `
    <p>foo<strong><anchor />bold<focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<anchor />bold<focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: removes a mark with selecting part of a text', () => {
    const content = `
    <p><strong>foo<anchor />bold<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong><anchor />bold<focus /><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: the mark already exists', () => {
    const content = `
    <p><strong>foo<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong>\u200B<focus /><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: the mark already exists', () => {
    const content = `
    <p><strong>foo<anchor />bold<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong><anchor />bold<focus /><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: removes a mark in another mark', () => {
    const content = `
    <p><i>foo</i><strong><i>\u200B<focus /></i></strong><i>bar</i></p>
    `;
    const output = `
    <p><i>foo</i><i>\u200B<focus /></i><i>bar</i></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: removes a mark in another mark', () => {
    const content = `
    <p><i>foo</i><anchor /><strong><i>bold</i></strong><focus /><i>bar</i></p>
    `;
    const output = `
    <p><i>foo</i><anchor /><i>bold</i><focus /><i>bar</i></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

  it('expanded range: no selected text', () => {
    const content = `
    <p><i>foo<anchor /></i><strong><focus />bar</strong></p>
    `;
    const output = `
    <p><i>foo</i><focus /><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range);
      },
    );
  });

  it('expanded range: astride a block', () => {
    const content = `
    <p><anchor /><i>foo</i></p>
    <p>one<strong>two</strong>three</p>
    <p>bar<focus /></p>
    `;
    const output = `
    <p><anchor />foo</p>
    <p>onetwothree</p>
    <p>bar<focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range);
      },
    );
  });

  it('expanded range: with zeroWidthSpace', () => {
    const content = `
    <p><anchor />foo<strong>\u200B</strong>b\u200Bar<focus /></p>
    `;
    const output = `
    <p><anchor />foobar<focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range);
      },
    );
  });

  it('the cursor is at the left of the inline box', () => {
    const content = `
    <p><lake-box type="inline" name="inlineBox" focus="left"></lake-box></p>
    <p>foo</p>
    `;
    const output = `
    <p><lake-box type="inline" name="inlineBox" focus="left"></lake-box></p>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range);
      },
    );
  });

  it('removes marks after selecting content with box', () => {
    const content = `
    <p>foo</p>
    <anchor /><lake-box type="block" name="blockBox"></lake-box>
    <p><lake-box type="inline" name="inlineBox"></lake-box><strong>bar</strong><focus /></p>
    `;
    const output = `
    <p>foo</p>
    <anchor /><lake-box type="block" name="blockBox"></lake-box>
    <p><lake-box type="inline" name="inlineBox"></lake-box>bar<focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range);
      },
    );
  });

});
