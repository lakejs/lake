import { testOperation } from '../utils';
import { Box } from '../../src/types/box';
import { insertBox } from '../../src/operations/insert-box';

const imageBox: Box = {
  type: 'inline',
  name: 'image',
  render: () => '<img />',
};

const hrBox: Box = {
  type: 'block',
  name: 'hr',
  render: () => '<hr />',
};

describe('operations / insert-box', () => {

  it('inserts a inline box', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image"></lake-box><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, imageBox);
      },
    );
  });

  it('inserts a block box when the cursor is at the beginning of the paragraph', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box><focus />
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, hrBox);
      },
    );
  });

  it('inserts a block box when the cursor is at the end of the paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr"></lake-box><focus />
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, hrBox);
      },
    );
  });

});
