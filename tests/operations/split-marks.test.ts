import { testOperation } from '../utils';
import { splitMarks } from '../../src/operations';

describe('operations.splitMarks()', () => {

  it('the selection is cursor state', () => {
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

  it('the cursor is at the beginning of the text', () => {
    const content = `
    <p><strong><focus />foo</strong></p>
    `;
    const output = `
    <p><strong></strong><focus /><strong>foo</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('the cursor is at the end of the text', () => {
    const content = `
    <p><strong>foo<focus /></strong></p>
    `;
    const output = `
    <p><strong>foo</strong><focus /><strong></strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('the cursor is among the marks', () => {
    const content = `
    <p><strong>beginning<em>one</em><focus /><em>two</em>end</strong></p>
    `;
    const output = `
    <p><strong>beginning<em>one</em></strong><focus /><strong><em>two</em>end</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('to split nested masks with splitting text', () => {
    const content = `
    <p><strong>beginning<em>one<focus />two</em>end</strong></p>
    `;
    const output = `
    <p><strong>beginning<em>one</em></strong><focus /><strong><em>two</em>end</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('to split nested masks without splitting text', () => {
    const content = `
    <p><strong>beginning<em><focus />foo</em>end</strong></p>
    `;
    const output = `
    <p><strong>beginning<em></em></strong><focus /><strong><em>foo</em>end</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('to split three levels of nested masks', () => {
    const content = `
    <p><strong>beginning<em>one<span><focus />two</span></em>end</strong></p>
    `;
    const output = `
    <p><strong>beginning<em>one<span></span></em></strong><focus /><strong><em><span>two</span></em>end</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        splitMarks(range);
      },
    );
  });

  it('the selection is a part of a text node', () => {
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

});
