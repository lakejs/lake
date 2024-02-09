import { expect } from 'chai';
import { boxes } from '../../src/storage/boxes';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Box } from '../../src/models/box';

describe('models / box', () => {

  let container: Nodes;

  let effectCount = 0;

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      value: {
        url: 'http://foo.com',
      },
      render: box => `<img src="${box.value.url}" />`,
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
      html: () => '<hr />',
    });
    boxes.set('effectBox', {
      type: 'block',
      name: 'blockBox',
      render: box => {
        box.useEffect(() => {
          effectCount++;
          box.node.addClass('effect-setup');
          return () => {
            effectCount--;
            box.node.removeClass('effect-setup');
          };
        });
        return '<hr />';
      },
    });
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
    boxes.delete('effectBox');
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
    expect(box.type).to.equal('block');
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

  it('method: useEffect', () => {
    container.html('<lake-box type="block" name="effectBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    expect(effectCount).to.equal(0);
    box.render();
    expect(effectCount).to.equal(1);
    expect(container.find('lake-box').hasClass('effect-setup')).to.equal(true);
    box.unmount();
    expect(effectCount).to.equal(0);
    expect(container.find('lake-box').hasClass('effect-setup')).to.equal(false);
    box.render();
    expect(effectCount).to.equal(1);
    expect(container.find('lake-box').hasClass('effect-setup')).to.equal(true);
    new Box(container.find('lake-box')).unmount();
    expect(effectCount).to.equal(0);
    expect(container.find('lake-box').hasClass('effect-setup')).to.equal(false);
  });

  it('method: render', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.render();
    expect(container.find('lake-box').children().length).to.equal(3);
  });

  it('method: unmount', () => {
    const content = '<p>foo</p><lake-box type="block" name="blockBox"></lake-box>';
    container.html(content);
    const box = new Box(container.find('lake-box'));
    box.render();
    expect(container.html()).not.to.equal(content);
    box.unmount();
    expect(container.html()).to.equal(content);
  });

  it('method: getHTML', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.render();
    expect(box.getHTML()).to.equal('<hr />');
  });

});
