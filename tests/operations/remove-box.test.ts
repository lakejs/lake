import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { Box } from '../../src/models/box';
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
    <p><focus />foo<lake-box type="inline" name="inlineBox"></lake-box></p>
    `;
    const output = `
    <p>foo<focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        const container = range.startNode.closestContainer();
        const boxNode = container.find('lake-box');
        const box = new Box(boxNode);
        box.render();
        range.selectBoxLeft(boxNode);
        removeBox(range);
      },
    );
  });

  it('remove a block box', () => {
    const content = `
    <lake-box type="block" name="blockBox"></lake-box>
    <p><focus />foo</p>
    `;
    const output = `
    <p><br /><focus /></p>
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
        range.selectBoxLeft(boxNode);
        removeBox(range);
      },
    );
  });

});
