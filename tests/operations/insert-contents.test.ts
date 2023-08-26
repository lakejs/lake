import { testOperation } from '../utils';
import { insertContents } from '../../src/operations';

describe('operations.insertContents()', () => {

  it('to insert an container after text node', () => {
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

  it('to insert multi-container after text node', () => {
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

  it('to call insertContents() several times consecutively', () => {
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
