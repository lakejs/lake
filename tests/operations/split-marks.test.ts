import { testOperation } from '../utils';
import { splitMarks } from '../../src/operations';

describe('operations.splitMarks()', () => {

  it('the selection is cursor state', () => {
    const content = `
    <p><strong>one<focus />two</strong></p>
    `;
    const output = `
    <p><strong>one</strong><strong><focus /></strong><strong>two</strong></p>
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
    <p><strong>one</strong><strong><anchor />two<focus /></strong><strong>three</strong></p>
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
