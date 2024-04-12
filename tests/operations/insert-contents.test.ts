import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { insertContents } from '../../src/operations/insert-contents';

describe('operations / insert-contents', () => {

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

  it('calls the method several times consecutively', () => {
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
        insertContents(range, '<p>bar</p>');
      },
    );
  });

});
