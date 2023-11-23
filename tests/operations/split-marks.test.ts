import { testOperation } from '../utils';
import { splitMarks } from '../../src/operations/split-marks';

describe('operations / split-marks', () => {

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

});
