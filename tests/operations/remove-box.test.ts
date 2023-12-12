import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { removeBox } from '../../src/operations/remove-box';

describe('operations / remove-box', () => {

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

  it('remove a inline box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="inlineBox" focus="right"></lake-box></p>
    `;
    const output = `
    <p>foo<focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeBox(range);
      },
    );
  });

  it('remove a block box', () => {
    const content = `
    <lake-box type="block" name="blockBox" focus="right"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <p><br /><focus /></p>
    <p>foo</p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeBox(range);
      },
    );
  });

  it('the cursor is ouside the box', () => {
    const content = `
    <p><focus />foo<lake-box type="inline" name="inlineBox"></lake-box></p>
    `;
    const output = `
    <p><focus />foo<lake-box type="inline" name="inlineBox"></lake-box></p>
    `;
    testOperation(
      content,
      output,
      range => {
        removeBox(range);
      },
    );
  });

});
