import { testOperation } from '../utils';
import { query } from '../../src/utils';
import { insertNode } from '../../src/operations/insert-node';

describe('operations.insertNode()', () => {

  it('inserts a native node when no text is selected', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<em>italic</em><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertNode(range, query('<em>italic</em>').get(0));
      },
    );
  });

  it('inserts a native node when text is selected', () => {
    const content = `
    <strong><anchor />foo<focus /></strong>bar
    `;
    const output = `
    <strong><em>italic</em><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertNode(range, query('<em>italic</em>').get(0));
      },
    );
  });

  it('inserts a nodes when no text is selected', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<em>italic</em><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertNode(range, query('<em>italic</em>'));
      },
    );
  });

  it('inserts a nodes when text is selected', () => {
    const content = `
    <strong><anchor />foo<focus /></strong>bar
    `;
    const output = `
    <strong><em>italic</em><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertNode(range, query('<em>italic</em>'));
      },
    );
  });

});
