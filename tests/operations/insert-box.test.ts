import { expect } from 'chai';
import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { Box } from '../../src/models/box';
import { insertBox } from '../../src/operations/insert-box';

describe('operations / insert-box', () => {

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

  it('inserts a inline box', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="inlineBox"></lake-box></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
        expect(range.isBoxRight).to.equal(true);
      },
    );
  });

  it('inserts a block box when the cursor is at the beginning of the paragraph', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'blockBox');
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
    <lake-box type="block" name="blockBox"></lake-box>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'blockBox');
        expect(range.isBoxRight).to.equal(true);
      },
    );
  });

  it('inserts a block box when the cursor is at the right of the box', () => {
    const content = `
    <lake-box type="block" name="blockBox"></lake-box>
    <p><focus />foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox"></lake-box>
    <lake-box type="block" name="blockBox"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const container = range.startNode.closestContainer();
        const boxNode = container.find('lake-box');
        const box = new Box(boxNode);
        box.render();
        range.selectBoxRight(boxNode);
        insertBox(range, 'blockBox');
        expect(range.isBoxRight).to.equal(true);
      },
    );
  });

});
