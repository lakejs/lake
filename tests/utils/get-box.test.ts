import { boxes } from '../../src/storage/boxes';
import { getInstanceMap } from '../../src/storage/box-instances';
import { query } from '../../src/utils/query';
import { getBox } from '../../src/utils/get-box';
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

  it('parameter is a name', () => {
    const box1 = getBox('blockBox');
    expect(box1.name).to.equal('blockBox');
    expect(getInstanceMap(0).get(box1.node.id) === box1).to.equal(true);
    const box2 = getBox('blockBox');
    expect(getInstanceMap(0).get(box2.node.id) === box2).to.equal(true);
    expect(box2 === box1).to.equal(false);
    container.empty();
    container.append(box2.node);
    const box3 = getBox(container.find('lake-box'));
    expect(getInstanceMap(0).get(box2.node.id)).to.equal(undefined);
    expect(getInstanceMap(container.id).get(box2.node.id) === box2).to.equal(true);
    expect(box3 === box2).to.equal(true);
  });

  it('no container', () => {
    container.removeAttr('contenteditable');
    const boxNode = container.find('lake-box');
    const box1 = getBox(boxNode);
    expect(box1.name).to.equal('blockBox');
    expect(getInstanceMap(0).get(box1.node.id) === box1).to.equal(true);
    const box2 = getBox(boxNode);
    expect(getInstanceMap(0).get(box2.node.id) === box2).to.equal(true);
    expect(box2 === box1).to.equal(true);
    container.attr('contenteditable', 'true');
    const box3 = getBox(boxNode);
    expect(getInstanceMap(0).get(box2.node.id)).to.equal(undefined);
    expect(getInstanceMap(container.id).get(box2.node.id) === box2).to.equal(true);
    expect(box3 === box2).to.equal(true);
  });

  it('has container', () => {
    const boxNode = container.find('lake-box');
    const box1 = getBox(boxNode);
    expect(box1.name).to.equal('blockBox');
    expect(getInstanceMap(container.id).get(box1.node.id) === box1).to.equal(true);
    const box2 = getBox(boxNode);
    expect(getInstanceMap(container.id).get(box2.node.id) === box2).to.equal(true);
    expect(box2 === box1).to.equal(true);
  });

  it('parameter is a native node', () => {
    const boxNode = container.find('lake-box');
    const box1 = getBox(boxNode.get(0));
    expect(box1.name).to.equal('blockBox');
    expect(getInstanceMap(container.id).get(box1.node.id) === box1).to.equal(true);
    const box2 = getBox(boxNode);
    expect(getInstanceMap(container.id).get(box2.node.id) === box2).to.equal(true);
    expect(box2 === box1).to.equal(true);
  });

});
