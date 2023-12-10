import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { deleteContents } from '../../src/operations/delete-contents';

describe('operations / delete-contents', () => {

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
    <p>foo1<focus />bar2</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('the cursor is at the left of the box', () => {
    const content = `
    <lake-box type="block" name="blockBox" focus="left"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox" focus="left"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        deleteContents(range);
      },
    );
  });

  it('the start position of the range is at the left of the box', () => {
    const content = `
    <anchor /><lake-box type="block" name="blockBox"></lake-box>
    <p><focus />foo</p>
    `;
    const output = `
    <p><focus />foo</p>
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
