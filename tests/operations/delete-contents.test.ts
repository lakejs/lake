import { testOperation } from '../utils';
import { deleteContents } from '../../src/operations/delete-contents';

describe('operations.deleteContents()', () => {

  it('deletes the selected text', () => {
    const content = `
    <p>one<anchor />two<focus />three</p>
    `;
    const output = `
    <p>one<focus />three</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('deletes part of two blocks', () => {
    const content = `
    <p>foo1<anchor />bar1</p>
    <p>foo2<focus />bar2</p>
    `;
    const output = `
    <p>foo1</p>
    <focus /><p>bar2</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

});
