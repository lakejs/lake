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

  it('should insert an inline box into the end of a paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="inlineBox" focus="end"></lake-box></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
      },
    );
  });

  it('should insert an inline box into the start strip of a box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="inlineBox" focus="end"></lake-box><lake-box type="inline" name="inlineBox"></lake-box>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
      },
    );
  });

  it('should insert an inline box into the end strip of a box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="inlineBox" focus="end"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="inlineBox"></lake-box><lake-box type="inline" name="inlineBox" focus="end"></lake-box>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const box = insertBox(range, 'inlineBox');
        expect(box?.node.name).to.equal('lake-box');
      },
    );
  });

  it('should insert an inline box into a mark', () => {
    const content = `
    <p><strong>foo<focus />bar</strong></p>
    `;
    const output = `
    <p><strong>foo</strong><lake-box type="inline" name="inlineBox" focus="end"></lake-box><strong>bar</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
      },
    );
  });

  it('should insert an inline box into the beginning of a mark', () => {
    const content = `
    <p><strong><focus />foo</strong></p>
    `;
    const output = `
    <p><lake-box type="inline" name="inlineBox" focus="end"></lake-box><strong>foo</strong></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
      },
    );
  });

  it('should insert an inline box into the end of a mark', () => {
    const content = `
    <p><strong>foo<focus /></strong></p>
    `;
    const output = `
    <p><strong>foo</strong><lake-box type="inline" name="inlineBox" focus="end"></lake-box></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
      },
    );
  });

  it('should insert an inline box into an empty mark', () => {
    const content = `
    <p><strong>\u200B<focus /></strong></p>
    `;
    const output = `
    <p><lake-box type="inline" name="inlineBox" focus="end"></lake-box></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
      },
    );
  });

  it('should insert an inline box when there is no block', () => {
    const content = `
    <table><tr><td><p><br /></p></td></tr></table><focus /><p>foo</p>
    `;
    const output = `
    <table><tr><td><p><br /></p></td></tr></table><p><lake-box type="inline" name="inlineBox" focus="end"></lake-box></p><p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'inlineBox');
      },
    );
  });

  it('should insert a block box when the cursor is at the beginning of a paragraph', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox" focus="end"></lake-box>
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

  it('should insert a block box when the cursor is at the end of a paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="blockBox" focus="end"></lake-box>
    `;
    testOperation(
      content,
      output,
      range => {
        insertBox(range, 'blockBox');
      },
    );
  });

  it('should insert a block box when the cursor is at the end of a box', () => {
    const content = `
    <lake-box type="block" name="blockBox" focus="end"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="blockBox"></lake-box>
    <lake-box type="block" name="blockBox" focus="end"></lake-box>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        const box = insertBox(range, 'blockBox');
        expect(box?.node.name).to.equal('lake-box');
      },
    );
  });

});
