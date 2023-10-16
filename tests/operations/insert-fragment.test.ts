import { testOperation } from '../utils';
import { query } from '../../src/utils';
import { insertFragment } from '../../src/operations/insert-fragment';

describe('operations.insertFragment()', () => {

  it('inserts a DocumentFragment object', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<em>italic</em>text<focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(query('<em>italic</em>').get(0));
        fragment.appendChild(document.createTextNode('text'));
        insertFragment(range, fragment);
      },
    );
  });

  it('inserts a DocumentFragment object while the text is selected', () => {
    const content = `
    <strong><anchor />foo<focus /></strong>bar
    `;
    const output = `
    <strong><em>italic</em>text<focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(query('<em>italic</em>').get(0));
        fragment.appendChild(document.createTextNode('text'));
        insertFragment(range, fragment);
      },
    );
  });

});
