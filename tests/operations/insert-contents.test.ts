import { testOperation } from '../utils';
import { insertContents } from '../../src/operations/insert-contents';

describe('operations.insertContents()', () => {

  it('inserts an element into after text node', () => {
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
        insertContents(range, '<i>italic</i>');
      },
    );
  });

  it('inserts multi-element into after text node', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<i>foo</i><span>bar</span><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertContents(range, '<i>foo</i><span>bar</span>');
      },
    );
  });

  it('calls insertContents() several times consecutively', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<i>foo</i><span>bar</span><strong>last</strong><focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        insertContents(range, '<i>foo</i>');
        insertContents(range, '<span>bar</span>');
        insertContents(range, '<strong>last</strong>');
      },
    );
  });

  it('inserts an element after selecting text', () => {
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
        insertContents(range, '<i>italic</i>');
      },
    );
  });

});
