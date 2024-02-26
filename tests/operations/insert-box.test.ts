import { expect } from 'chai';
import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
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

  it('inserts an inline box into the end of the paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="inlineBox" focus="right"></lake-box></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
      },
    );
  });

  it('inserts an inline box into the left strip of box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="inlineBox" focus="left"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="inlineBox" focus="right"></lake-box><lake-box type="inline" name="inlineBox"></lake-box>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
      },
    );
  });

  it('inserts an inline box into the right strip of box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="inlineBox" focus="right"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="inlineBox"></lake-box><lake-box type="inline" name="inlineBox" focus="right"></lake-box>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const boxNode = insertBox(range, 'inlineBox');
        expect(boxNode.name).to.equal('lake-box');
      },
    );
  });

  it('inserts a block box when the cursor is at the beginning of the paragraph', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox" focus="right"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'blockBox');
      },
    );
  });

  it('inserts a block box when the cursor is at the end of the paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="blockBox" focus="right"></lake-box>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'blockBox');
      },
    );
  });

  it('inserts a block box when the cursor is at the right of the box', () => {
    const content = `
    <lake-box type="block" name="blockBox" focus="right"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox"></lake-box>
    <lake-box type="block" name="blockBox" focus="right"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const boxNode = insertBox(range, 'blockBox');
        expect(boxNode.name).to.equal('lake-box');
      },
    );
  });

});
