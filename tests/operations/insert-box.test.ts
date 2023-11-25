import { expect } from 'chai';
import { boxDataMap } from '../../src/data/box';
import { testOperation } from '../utils';
import { insertBox } from '../../src/operations/insert-box';

boxDataMap.set('image', {
  type: 'inline',
  name: 'image',
  render: () => '<img />',
});

boxDataMap.set('hr', {
  type: 'block',
  name: 'hr',
  render: () => '<hr />',
});

describe('operations / insert-box', () => {

  it('inserts a inline box', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image"></lake-box></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'image');
        expect(range.isBoxRight).to.equal(true);
      },
    );
  });

  it('inserts a block box when the cursor is at the beginning of the paragraph', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'hr');
        expect(range.isBoxRight).to.equal(true);
      },
    );
  });

  it('inserts a block box when the cursor is at the end of the paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr"></lake-box>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'hr');
        expect(range.isBoxRight).to.equal(true);
      },
    );
  });

});
