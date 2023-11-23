import { testOperation } from '../utils';
import { query } from '../../src/utils';
import { insertNode } from '../../src/operations/insert-node';

describe('operations / insert-node', () => {

  it('inserts a native node when no text is selected', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<i>italic</i><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertNode(range, query('<i>italic</i>').get(0));
      },
    );
  });

  it('inserts a native node when text is selected', () => {
    const content = `
    <strong><anchor />foo<focus /></strong>bar
    `;
    const output = `
    <strong><i>italic</i><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertNode(range, query('<i>italic</i>').get(0));
      },
    );
  });

  it('inserts a nodes when no text is selected', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<i>italic</i><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertNode(range, query('<i>italic</i>'));
      },
    );
  });

  it('inserts a nodes when text is selected', () => {
    const content = `
    <strong><anchor />foo<focus /></strong>bar
    `;
    const output = `
    <strong><i>italic</i><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertNode(range, query('<i>italic</i>'));
      },
    );
  });

});
