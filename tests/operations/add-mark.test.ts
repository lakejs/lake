import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { Box } from '../../src/models/box';
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

  it('collapsed range: adds a mark', () => {
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

  it('expanded range: adds a mark', () => {
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


  it('collapsed range: the mark already exists', () => {
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

  it('expanded range: the mark already exists', () => {
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

  it('collapsed range: adds a mark in another mark', () => {
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

  it('collapsed range: adds a style in another span', () => {
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

  it('expanded range: adds a mark in another mark', () => {
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

  it('expanded range: adds a mark in another nested mark', () => {
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

  it('expanded range: the beginning of the range is in another mark', () => {
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

  it('expanded range: the end of the range is in another mark', () => {
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

  it('should add a strong to an em', () => {
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

  it('should add a strong to an em with a text', () => {
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

  it('should add a CSS property to a span', () => {
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

  it('should add a CSS property to a span when only text is selected', () => {
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

  it('should add a CSS property to a span with a text', () => {
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

  it('should add a CSS property to a span that is above a strong', () => {
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

  it('should remove a CSS property from a span', () => {
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

  it('should remove the style attribute when its value is empty', () => {
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

  it('should remove br', () => {
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

  it('should remove br with empty text', () => {
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

  it('the cursor is at the left of the inline box', () => {
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
        const box = new Box(boxNode);
        box.render();
        range.selectBoxLeft(boxNode);
        addMark(range, '<strong />');
      },
    );
  });

  it('the cursor is at the right of the inline box', () => {
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
        const box = new Box(boxNode);
        box.render();
        range.selectBoxRight(boxNode);
        addMark(range, '<strong />');
      },
    );
  });

  it('the cursor is at the left of the block box', () => {
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
        const box = new Box(boxNode);
        box.render();
        range.selectBoxLeft(boxNode);
        addMark(range, '<strong />');
      },
    );
  });

  it('the cursor is at the right of the block box', () => {
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
        const box = new Box(boxNode);
        box.render();
        boxNode.debug();
        range.selectBoxRight(boxNode);
        addMark(range, '<strong />');
      },
    );
  });

  it('add marks after selecting content with box', () => {
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
        const box = new Box(boxNode);
        box.render();
        boxNode.debug();
        range.selectBoxLeft(boxNode);
        range.setEnd(container.find('p').eq(1), 2);
        addMark(range, '<strong />');
      },
    );
  });

});
