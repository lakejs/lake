import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { getBox } from '../../src/utils';
import { addMark } from '../../src/operations/add-mark';

describe('operations / add-mark', () => {

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

  it('collapsed range: should add a mark', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<strong>\u200B<focus /></strong>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: should add a mark', () => {
    const content = `
    <p>foo<anchor />bold<focus />bar</p>
    `;
    const output = `
    <p>foo<anchor /><strong>bold</strong><focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: when a block selected', () => {
    const content = `
    <anchor /><p>foo</p><focus />
    `;
    const output = `
    <anchor /><p><strong>foo</strong></p><focus />
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: when there is no block', () => {
    const content = `
    <anchor />foo<focus />
    `;
    const output = `
    <anchor /><strong>foo</strong><focus />
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: when the mark already exists', () => {
    const content = `
    <p><strong>foo<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong><strong>\u200B<focus /></strong><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: when there is an empty another mark', () => {
    const content = `
    <p>foo<strong>\u200B<focus /></strong>bar</p>
    `;
    const output = `
    <p>foo<i><strong>\u200B<focus /></strong></i>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<i />');
      },
    );
  });


  it('expanded range: when the mark already exists', () => {
    const content = `
    <p><strong>foo<anchor />bold<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong><anchor /><strong>bold</strong><focus /><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: should add a mark inside another mark', () => {
    const content = `
    <p><i>foo<focus />bar</i></p>
    `;
    const output = `
    <p><i>foo</i><strong><i>\u200B<focus /></i></strong><i>bar</i></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: should add a style inside another span tag', () => {
    const content = `
    <p><span style="color: red;">foo<focus />bar</span></p>
    `;
    const output = `
    <p><span style="color: red;">foo</span><span style="color: red; font-size: 18px;">\u200B<focus /></span><span style="color: red;">bar</span></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="font-size: 18px;" />');
      },
    );
  });

  it('expanded range: should add a mark inside another mark', () => {
    const content = `
    <p><i>foo<anchor />bold<focus />bar</i></p>
    `;
    const output = `
    <p><i>foo</i><anchor /><strong><i>bold</i></strong><focus /><i>bar</i></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: should add a mark inside another nested mark', () => {
    const content = `
    <p><strong><i>foo<anchor />bold<focus />bar</i></strong></p>
    `;
    const output = `
    <p><strong><i>foo</i></strong><anchor /><i><strong><i>bold</i></strong></i><focus /><strong><i>bar</i></strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<i />');
      },
    );
  });

  it('expanded range: the beginning of the range is inside another mark', () => {
    const content = `
    <p><i><anchor />one</i>two<focus />three</p>
    `;
    const output = `
    <p><anchor /><strong><i>one</i></strong><strong>two</strong><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: the end of the range is inside another mark', () => {
    const content = `
    <p>one<anchor /><i>two<focus />three</i></p>
    `;
    const output = `
    <p>one<anchor /><strong><i>two</i></strong><focus /><i>three</i></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('expanded range: astride a block', () => {
    const content = `
    <p><anchor />foo</p>
    <p>one<strong>two</strong>three</p>
    <p>bar<focus /></p>
    `;
    const output = `
    <p><anchor /><i>foo</i></p>
    <p><i>one</i><i><strong>two</strong></i><i>three</i></p>
    <p><i>bar</i><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<i />');
      },
    );
  });

  it('should add a strong tag to an em tag', () => {
    const content = `
    <p>one<anchor /><i>two</i><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><strong><i>two</i></strong><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('should add a strong tag to an em tag with a text', () => {
    const content = `
    <p>one<anchor /><i>two</i>foo<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><strong><i>two</i></strong><strong>foo</strong><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('collapsed range: should add a CSS property to a span tag', () => {
    const content = `
    <p>foo<span style="color: red;">\u200B<focus /></span>bar</p>
    `;
    const output = `
    <p>foo<span style="color: red; text-decoration: underline;">\u200B<focus /></span>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: underline;" />');
      },
    );
  });

  it('collapsed range: should add a CSS property to a span tag containing another mark', () => {
    const content = `
    <p>foo<span style="color: red;"><i>\u200B<focus /></i></span>bar</p>
    `;
    const output = `
    <p>foo<span style="color: red; text-decoration: underline;"><i>\u200B<focus /></i></span>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: underline;" />');
      },
    );
  });

  it('expanded range: should add a CSS property to a span tag', () => {
    const content = `
    <p>one<anchor /><span style="color: red;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red; text-decoration: underline;">two</span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: underline;" />');
      },
    );
  });

  it('should add a CSS property to a span tag when only text is selected', () => {
    const content = `
    <p>one<span style="color: red;"><anchor />two<focus /></span>three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red; text-decoration: underline;">two</span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: underline;" />');
      },
    );
  });

  it('should add a CSS property to a span tag with a text', () => {
    const content = `
    <p>one<anchor /><span style="color: red;">two</span>foo<focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red; text-decoration: underline;">two</span><span style="text-decoration: underline;">foo</span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: underline;" />');
      },
    );
  });

  it('should add a CSS property to a span tag that is containing a strong tag', () => {
    const content = `
    <p>one<anchor /><span style="color: red;"><strong>two</strong></span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red; text-decoration: underline;"><strong>two</strong></span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: underline;" />');
      },
    );
  });

  it('should remove a CSS property from a span tag', () => {
    const content = `
    <p>one<anchor /><span style="color: red; text-decoration: underline;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span style="color: red;">two</span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: ;" />');
      },
    );
  });

  it('should remove a CSS property when its value is empty', () => {
    const content = `
    <p>one<anchor /><span class="test" style="text-decoration: underline;">two</span><focus />three</p>
    `;
    const output = `
    <p>one<anchor /><span class="test">two</span><focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<span style="text-decoration: ;" />');
      },
    );
  });

  it('should remove br tag', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><strong>\u200B<focus /></strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        addMark(range, '<strong />');
      },
    );
  });

  it('should remove br tag with empty text node', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><strong>\u200B<focus /></strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        range.startNode.closestBlock().prepend(document.createTextNode(''));
        addMark(range, '<strong />');
      },
    );
  });

  it('the cursor is at the start of the inline box', () => {
    const content = `
    <p><lake-box type="inline" name="inlineBox"></lake-box></p>
    <p><focus />foo</p>
    `;
    const output = `
    <p><strong>\u200B<focus /></strong><lake-box type="inline" name="inlineBox"></lake-box></p>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const container = range.startNode.closestContainer();
        const boxNode = container.find('lake-box');
        const box = getBox(boxNode);
        box.render();
        range.selectBoxStart(boxNode);
        addMark(range, '<strong />');
      },
    );
  });

  it('the cursor is at the end of the inline box', () => {
    const content = `
    <p><lake-box type="inline" name="inlineBox"></lake-box></p>
    <p><focus />foo</p>
    `;
    const output = `
    <p><lake-box type="inline" name="inlineBox"></lake-box><strong>\u200B<focus /></strong></p>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const container = range.startNode.closestContainer();
        const boxNode = container.find('lake-box');
        const box = getBox(boxNode);
        box.render();
        range.selectBoxEnd(boxNode);
        addMark(range, '<strong />');
      },
    );
  });

  it('the cursor is at the start of the block box', () => {
    const content = `
    <lake-box type="block" name="blockBox"></lake-box>
    <p><focus />foo</p>
    `;
    const output = `
    <p><strong>\u200B<focus /></strong></p>
    <lake-box type="block" name="blockBox"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const container = range.startNode.closestContainer();
        const boxNode = container.find('lake-box');
        const box = getBox(boxNode);
        box.render();
        range.selectBoxStart(boxNode);
        addMark(range, '<strong />');
      },
    );
  });

  it('the cursor is at the end of the block box', () => {
    const content = `
    <lake-box type="block" name="blockBox"></lake-box>
    <p><focus />foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox"></lake-box>
    <p><strong>\u200B<focus /></strong></p>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const container = range.startNode.closestContainer();
        const boxNode = container.find('lake-box');
        const box = getBox(boxNode);
        box.render();
        range.selectBoxEnd(boxNode);
        addMark(range, '<strong />');
      },
    );
  });

  it('should add marks when the contents with box are selected', () => {
    const content = `
    <p><focus />foo</p>
    <lake-box type="block" name="blockBox"></lake-box>
    <p><lake-box type="inline" name="inlineBox"></lake-box>bar</p>
    `;
    const output = `
    <p>foo</p>
    <anchor /><lake-box type="block" name="blockBox"></lake-box>
    <p><lake-box type="inline" name="inlineBox"></lake-box><strong>bar</strong><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        const container = range.startNode.closestContainer();
        const boxNode = container.find('lake-box').eq(0);
        const box = getBox(boxNode);
        box.render();
        range.selectBoxStart(boxNode);
        range.setEnd(container.find('p').eq(1), 2);
        addMark(range, '<strong />');
      },
    );
  });

});
