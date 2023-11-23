import { testOperation } from '../utils';
import { fixList } from '../../src/operations/fix-list';

describe('operations / fix-list', () => {

  it('adds start attributes', () => {
    const content = `
    <ol><li>one</li></ol>
    <ol><li>two<focus /></li></ol>
    `;
    const output = `
    <ol start="1"><li>one</li></ol>
    <ol start="2"><li>two<focus /></li></ol>
    `;
    testOperation(
      content,
      output,
      range => {
        fixList(range);
      },
    );
  });

});
