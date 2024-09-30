import { click } from '../utils';
import { boxes } from '../../src/storage/boxes';
import { icons } from '../../src/icons';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Box } from '../../src/models/box';

const imageUrl = '../assets/images/heaven-lake-256.png';

describe('models / box', () => {

  let container: Nodes;

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      value: {
        url: imageUrl,
      },
      render: box => `<img src="${box.value.url}" style="width: 256px; height: 186px;" />`,
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
      html: () => '<hr />',
    });
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
    container.remove();
  });

  it('constructor: a string', () => {
    const box = new Box('blockBox');
    container.append(box.node);
    expect(container.html()).to.equal('<lake-box type="block" name="blockBox"></lake-box>');
  });

  it('constructor: a native node', () => {
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

  it('method: updateValue', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.value = {
      a: 1,
      b: 2,
    };
    box.updateValue({
      b: 'updated',
    });
    box.updateValue('c', 'added');
    expect(box.value).to.deep.equal({
      a: 1,
      b: 'updated',
      c: 'added',
    });
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

  it('event: should emit blur event after the box was unmounted', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    let calledCount = 0;
    box.render();
    box.event.on('blur', () => calledCount++);
    box.unmount();
    expect(calledCount).to.equal(1);
  });

  it('event: should emit beforeunmount event after the box was unmounted', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    let calledCount = 0;
    box.render();
    box.event.on('beforeunmount', () => calledCount++);
    box.unmount();
    expect(calledCount).to.equal(1);
  });

  it('event: abount mouse', () => {
    container.html('<lake-box type="block" name="blockBox"></lake-box>');
    const box = new Box(container.find('lake-box'));
    box.render();
    const boxContainer = box.getContainer();
    boxContainer.emit('mouseenter');
    expect(boxContainer.hasClass('lake-box-hovered')).to.equal(true);
    boxContainer.emit('mouseleave');
    expect(boxContainer.hasClass('lake-box-hovered')).to.equal(false);
    boxContainer.addClass('lake-box-selected');
    boxContainer.emit('mouseenter');
    expect(boxContainer.hasClass('lake-box-hovered')).to.equal(false);
    boxContainer.addClass('lake-box-focused');
    boxContainer.emit('mouseenter');
    expect(boxContainer.hasClass('lake-box-hovered')).to.equal(false);
    boxContainer.addClass('lake-box-activated');
    boxContainer.emit('mouseenter');
    expect(boxContainer.hasClass('lake-box-hovered')).to.equal(false);
    boxContainer.emit('mousedown');
  });

  it('should update the value of the box', () => {
    container.html('<p><lake-box type="inline" name="inlineBox"></lake-box></p>');
    const box = new Box(container.find('lake-box'));
    box.render();
    const oldBoxContainer = box.getContainer();
    expect(container.find('lake-box img').attr('src')).to.equal(imageUrl);
    box.updateValue({
      url: '../assets/images/lac-gentau-256.jpg',
    });
    box.render();
    const newBoxContainer = box.getContainer();
    expect(oldBoxContainer.get(0) === newBoxContainer.get(0)).to.equal(true);
    expect(container.find('lake-box img').attr('src')).to.equal('../assets/images/lac-gentau-256.jpg');
  });

  it('should add a toolbar', () => {
    container.html('<p><lake-box type="inline" name="inlineBox"></lake-box></p>');
    const box = new Box(container.find('lake-box'));
    box.render();
    let calledCount = 0;
    box.setToolbar([{
      name: 'remove',
      type: 'button',
      icon: icons.get('remove'),
      tooltip: 'Remove',
      onClick: () => calledCount++,
    }]);
    box.event.emit('focus');
    expect(query(document.body).find('.lake-box-toolbar').computedCSS('display')).to.equal('flex');
    click(query(document.body).find('.lake-box-toolbar button[name="remove"]'));
    expect(calledCount).to.equal(1);
    box.event.emit('blur');
    expect(query(document.body).find('.lake-box-toolbar').length).to.equal(0);
  });

});
