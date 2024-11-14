import { testOperation } from '../utils';
import { insertBlock } from '../../src/operations/insert-block';

describe('operations / insert-block', () => {

  it('collapsed range: should insert a block', () => {
    const content = `
    <p><strong>foo<focus /></strong>bar</p>
    `;
    const output = `
    <p><strong>foo</strong></p><h1>heading<focus /></h1><p>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBlock(range, '<h1>heading</h1>');
      },
    );
  });

  it('expanded range: should insert a block', () => {
    const content = `
    <p><strong><anchor />foo<focus /></strong>bar</p>
    `;
    const output = `
    <h1>heading<focus /></h1><p>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBlock(range, '<h1>heading</h1>');
      },
    );
  });

  it('collapsed range: the cursor is positioned between two blocks', () => {
    const content = `
    <p>foo</p><focus /><p>bar</p>
    `;
    const output = `
    <p>foo</p><h1>heading<focus /></h1><p>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBlock(range, '<h1>heading</h1>');
      },
    );
  });

});
