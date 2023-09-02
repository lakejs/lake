import { testOperation } from '../utils';
import { removeMark } from '../../src/operations';

describe('operations.removeMark()', () => {

  it('collapsed range: adding a mark', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<strong><focus /></strong>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeMark(range, '<strong />');
      },
    );
  });

});
