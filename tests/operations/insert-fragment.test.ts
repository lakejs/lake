import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { query } from '../../src/utils';
import { Fragment } from '../../src/models/fragment';
import { insertFragment } from '../../src/operations/insert-fragment';

describe('operations / insert-fragment', () => {

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
  });

  it('inserts a fragment when no text is selected', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<i>italic</i>text<focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        const fragment = new Fragment();
        fragment.append('<i>italic</i>');
        fragment.append(document.createTextNode('text'));
        insertFragment(range, fragment);
      },
    );
  });

  it('inserts a native fragment when no text is selected', () => {
    const content = `
    <strong>foo<focus /></strong>bar
    `;
    const output = `
    <strong>foo<i>italic</i>text<focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(query('<i>italic</i>').get(0));
        fragment.appendChild(document.createTextNode('text'));
        insertFragment(range, fragment);
      },
    );
  });

  it('inserts a fragment after seleting text', () => {
    const content = `
    <strong><anchor />foo<focus /></strong>bar
    `;
    const output = `
    <strong><i>italic</i>text<focus /></strong>bar
    `;
    testOperation(
      content,
      output,
      range => {
        const fragment = new Fragment();
        fragment.append('<i>italic</i>');
        fragment.append(document.createTextNode('text'));
        insertFragment(range, fragment);
      },
    );
  });

  it('the cursor is at the start of the box', () => {
    const content = `
    <lake-box type="block" name="blockBox" focus="start"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <p>bar</p>
    <lake-box type="block" name="blockBox" focus="start"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const fragment = new Fragment();
        fragment.append('<p>bar</p>');
        insertFragment(range, fragment);
      },
    );
  });

});
