import { expect } from 'chai';
import { boxes } from '../../src/storage/boxes';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Box } from '../../src/models/box';

describe('models / box', () => {

  let container: Nodes;

  beforeEach(() => {
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
  });

  afterEach(() => {
    boxes.delete('blockBox');
    container.remove();
  });

  it('constructor: is a string', () => {
    const box = new Box('blockBox');
    container.append(box.node);
    expect(container.html()).to.equal('<lake-box type="block" name="blockBox"></lake-box>');
  });

  it('constructor: is a native node', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box').get(0));
    expect(box.name).to.equal('blockBox');
  });

  it('property: type', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.type = 'inline';
    expect(box.type).to.equal('inline');
  });

  it('property: name', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    expect(box.name).to.equal('blockBox');
  });

  it('property: value', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.value = {
      foo: 1,
    };
    expect(box.value.foo).to.equal(1);
  });

  it('method: render', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.render();
    expect(container.find('lake-box').children().length).to.equal(3);
  });

});
