import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { splitMarks } from '../../src/operations/split-marks';

describe('operations / split-marks', () => {

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

  it('collapsed range: splits a text and a mark', () => {
    const content = `
    <p><strong>one<focus />two</strong></p>
    `;
    const output = `
    <p><strong>one</strong><focus /><strong>two</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('expanded range: splits a text and a mark', () => {
    const content = `
    <p><strong>one<anchor />two<focus />three</strong></p>
    `;
    const output = `
    <p><strong>one</strong><anchor /><strong>two</strong><focus /><strong>three</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('collapsed range: splits a mark at the beginning of the text', () => {
    const content = `
    <p><strong><focus />foo</strong></p>
    `;
    const output = `
    <p><focus /><strong>foo</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('expanded range: splits a mark at the beginning of the text', () => {
    const content = `
    <p><strong><anchor />foo<focus />bar</strong></p>
    `;
    const output = `
    <p><anchor /><strong>foo</strong><focus /><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('collapsed range: splits a mark at the end of the text', () => {
    const content = `
    <p><strong>foo<focus /></strong></p>
    `;
    const output = `
    <p><strong>foo</strong><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('expanded range: splits a mark at the end of the text', () => {
    const content = `
    <p><strong>foo<anchor />bar<focus /></strong></p>
    `;
    const output = `
    <p><strong>foo</strong><anchor /><strong>bar</strong><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('collapsed range: splits a mark among the marks', () => {
    const content = `
    <p><strong>beginning<i>one</i><focus /><i>two</i>end</strong></p>
    `;
    const output = `
    <p><strong>beginning<i>one</i></strong><focus /><strong><i>two</i>end</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('collapsed range: splits a mark without parent mark', () => {
    const content = `
    <p><i>one</i>two<i>th<focus />ree</i>four<i>five</i></p>
    `;
    const output = `
    <p><i>one</i>two<i>th</i><focus /><i>ree</i>four<i>five</i></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('collapsed range: splits nested masks and a text', () => {
    const content = `
    <p><strong>beginning<i>one<focus />two</i>end</strong></p>
    `;
    const output = `
    <p><strong>beginning<i>one</i></strong><focus /><strong><i>two</i>end</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('collapsed range: splits nested masks without splitting text', () => {
    const content = `
    <p><strong>beginning<i><focus />foo</i>end</strong></p>
    `;
    const output = `
    <p><strong>beginning</strong><focus /><strong><i>foo</i>end</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('collapsed range: splits three levels of nested masks', () => {
    const content = `
    <p><strong>beginning<i>one<span><focus />two</span></i>end</strong></p>
    `;
    const output = `
    <p><strong>beginning<i>one</i></strong><focus /><strong><i><span>two</span></i>end</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('expanded range: splits three levels of nested masks', () => {
    const content = `
    <p><strong>beginning<i>one<span><anchor />two<focus /></span></i>end</strong></p>
    `;
    const output = `
    <p><strong>beginning<i>one</i></strong><anchor /><strong><i><span>two</span></i></strong><focus /><strong>end</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('collapsed range: the cursor is on the start strip of the inline box', () => {
    const content = `
    <p><strong>one<lake-box type="inline" name="inlineBox" focus="start"></lake-box>two</strong></p>
    `;
    const output = `
    <p><strong>one</strong><focus /><strong><lake-box type="inline" name="inlineBox"></lake-box>two</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('collapsed range: the cursor is on the end strip of the inline box', () => {
    const content = `
    <p><strong>one<lake-box type="inline" name="inlineBox" focus="end"></lake-box>two</strong></p>
    `;
    const output = `
    <p><strong>one<lake-box type="inline" name="inlineBox"></lake-box></strong><focus /><strong>two</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

});
