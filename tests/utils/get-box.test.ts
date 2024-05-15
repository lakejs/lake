import { boxes } from '../../src/storage/boxes';
import { query, getBox } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';

describe('utils / get-box', () => {

  let container: Nodes;

  beforeEach(() => {
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
    container = query('<div contenteditable="true"></div>');
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    query(document.body).append(container);
  });

  afterEach(() => {
    boxes.delete('blockBox');
    container.remove();
  });

  it('has container', () => {
    const boxNode = container.find('lake-box');
    const box1 = getBox(boxNode);
    expect(box1.name).to.equal('blockBox');
    const box2 = getBox(boxNode);
    expect(box2 === box1).to.equal(true);
  });

  it('no container', () => {
    container.removeAttr('contenteditable');
    const boxNode = container.find('lake-box');
    const box1 = getBox(boxNode);
    expect(box1.name).to.equal('blockBox');
    const box2 = getBox(boxNode);
    expect(box2 === box1).to.equal(false);
  });

  it('parameter is a native node', () => {
    const boxNode = container.find('lake-box');
    const box1 = getBox(boxNode.get(0));
    expect(box1.name).to.equal('blockBox');
    const box2 = getBox(boxNode);
    expect(box2 === box1).to.equal(true);
  });

  it('parameter is a box name', () => {
    const box1 = getBox('blockBox');
    expect(box1.name).to.equal('blockBox');
    const box2 = getBox('blockBox');
    expect(box2 === box1).to.equal(false);
  });

});
