import { testOperation } from '../utils';
import { insertContents } from '../../src/operations';

describe('operations.insertContents()', () => {

  it('inserts an element into after text node', () => {
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
        insertContents(range, '<em>italic</em>');
      },
    );
  });

  it('inserts multi-element into after text node', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<em>foo</em><span>bar</span><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertContents(range, '<em>foo</em><span>bar</span>');
      },
    );
  });

  it('calls insertContents() several times consecutively', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<em>foo</em><span>bar</span><strong>last</strong><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertContents(range, '<em>foo</em>');
        insertContents(range, '<span>bar</span>');
        insertContents(range, '<strong>last</strong>');
      },
    );
  });

});
