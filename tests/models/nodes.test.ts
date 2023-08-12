import { expect } from 'chai';
import { NativeElement } from '../../src/types/native';
import { Nodes } from '../../src/models';

describe('Nodes of models', () => {

  let element: Element;
  let elementTwo: Element;

  beforeEach(() => {
    element = document.createElement('div');
    element.innerHTML = 'one';
    document.body.appendChild(element);
    elementTwo = document.createElement('p');
    elementTwo.innerHTML = 'two';
    document.body.appendChild(elementTwo);
  });

  afterEach(() => {
    document.body.removeChild(element);
    document.body.removeChild(elementTwo);
  });

  it('property: length', () => {
    expect(new Nodes(element).length).to.equal(1);
    expect(new Nodes([element, document.body]).length).to.equal(2);
  });

  it('method: get', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.eq(1).html()).to.equal('two');
  });

  it('method: getAll', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.getAll().length).to.equal(3);
    expect((nodes.getAll()[1] as NativeElement).innerHTML).to.equal('two');
  });

  it('method: isElement', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.isElement(0)).to.equal(true);
  });

  it('method: isText', () => {
    const nodes = new Nodes([element, document.createTextNode('foo'), document.body]);
    expect(nodes.isText(1)).to.equal(true);
  });

  it('method: eq', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.eq(2).name(0)).to.equal('body');
  });

  it('method: id', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.id(0)).to.be.a('number');
    expect(nodes.id(1)).to.be.a('number');
  });

  it('method: name', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.name(0)).to.equal('div');
    expect(nodes.name(1)).to.equal('p');
  });

  it('method: each', () => {
    const textNode = document.createTextNode('foo');
    const nodes = new Nodes([element, textNode, elementTwo]);
    let firstNode: any;
    let secondNode: any;
    let thirdNode: any;
    const result = nodes.each((node, index) => {
      if (index === 0) {
        firstNode = node;
        return;
      }
      if (index === 1) {
        secondNode = node;
        return false;
      }
      if (index === 2) {
        thirdNode = node;
      }
    });
    expect(result).to.equal(nodes);
    expect(firstNode).to.equal(element);
    expect(secondNode).to.equal(textNode);
    expect(thirdNode).to.equal(undefined);
  });

  it('method: eachElement', () => {
    const textNode = document.createTextNode('foo');
    const nodes = new Nodes([element, textNode, elementTwo]);
    let firstNode: any;
    let secondNode: any;
    let thirdNode: any;
    const result = nodes.eachElement((node, index) => {
      if (index === 0) {
        firstNode = node;
        return;
      }
      if (index === 1) {
        secondNode = node;
      }
      if (index === 2) {
        thirdNode = node;
      }
    });
    expect(result).to.equal(nodes);
    expect(firstNode).to.equal(element);
    expect(secondNode).to.equal(undefined);
    expect(thirdNode).to.equal(elementTwo);
  });

  it('event methods: to add an event', () => {
    const nodes = new Nodes([element, document.body]);
    const listener = () => {
      element.innerHTML = 'click event';
    };
    // bind an event
    const onResult = nodes.on('click', listener);
    expect(onResult).to.equal(nodes);
    expect(nodes.getEventListeners(0).length).to.equal(1);
    expect(nodes.getEventListeners(0)[0].type).to.equal('click');
    expect(nodes.getEventListeners(0)[0].listener).to.equal(listener);
    expect(nodes.getEventListeners(1).length).to.equal(1);
    expect(nodes.getEventListeners(1)[0].type).to.equal('click');
    expect(nodes.getEventListeners(1)[0].listener).to.equal(listener);
    // remove an event
    const offResult = nodes.off('click', listener);
    expect(offResult).to.equal(nodes);
    expect(nodes.getEventListeners(0).length).to.equal(0);
    expect(nodes.getEventListeners(1).length).to.equal(0);
  });

  it('event methods: to add multi-event', () => {
    const nodes = new Nodes([element, document.body]);
    const clickListener = () => {
      element.innerHTML = 'click event';
    };
    const mousedownListener = () => {
      element.innerHTML = 'mousedown event';
    };
    const mouseupListener = () => {
      element.innerHTML = 'mouseup event';
    };
    // bind events
    nodes.on('click', clickListener);
    nodes.on('mousedown', mousedownListener);
    nodes.on('mouseup', mouseupListener);
    expect(nodes.getEventListeners(0).length).to.equal(3);
    expect(nodes.getEventListeners(0)[0].type).to.equal('click');
    expect(nodes.getEventListeners(0)[1].type).to.equal('mousedown');
    expect(nodes.getEventListeners(0)[2].type).to.equal('mouseup');
    // remove an event
    nodes.off('mousedown');
    expect(nodes.getEventListeners(0).length).to.equal(2);
    expect(nodes.getEventListeners(0)[0].type).to.equal('click');
    expect(nodes.getEventListeners(0)[1].type).to.equal('mouseup');
    nodes.fire('mousedown');
    expect(element.innerHTML).to.equal('one');
    // remove all events
    nodes.off();
    expect(nodes.getEventListeners(0).length).to.equal(0);
    nodes.fire('click');
    nodes.fire('mouseup');
    expect(element.innerHTML).to.equal('one');
  });

  it('event methods: to add multi-event that includes the same type', () => {
    const nodes = new Nodes(element);
    let clickCount = 0;
    const clickListenerOne = () => {
      element.innerHTML = 'click event one';
      clickCount++;
    };
    const clickListenerTwo = () => {
      element.innerHTML = 'click event two';
      clickCount++;
    };
    const mousedownListener = () => {
      element.innerHTML = 'mousedown event';
    };
    // bind events
    nodes.on('click', clickListenerOne);
    nodes.on('click', clickListenerTwo);
    nodes.on('mousedown', mousedownListener);
    expect(element.innerHTML).to.equal('one');
    nodes.fire('click');
    expect(element.innerHTML).to.equal('click event two');
    nodes.fire('click');
    expect(clickCount).to.equal(4);
    nodes.fire('mousedown');
    expect(element.innerHTML).to.equal('mousedown event');
    // remove all events
    nodes.off();
  });

  it('event methods: an element with multi-element-instance', () => {
    const nodesOne = new Nodes(element);
    let clickCount = 0;
    const clickListenerOne = () => {
      element.innerHTML = 'click event one';
      clickCount++;
    };
    const clickListenerTwo = () => {
      element.innerHTML = 'click event two';
      clickCount++;
    };
    const nodesTwo = new Nodes(element);
    // bind events
    nodesOne.on('click', clickListenerOne);
    nodesOne.on('click', clickListenerTwo);
    nodesTwo.fire('click');
    expect(element.innerHTML).to.equal('click event two');
    nodesTwo.fire('click');
    expect(clickCount).to.equal(4);
    // remove all events
    nodesTwo.off();
    expect(nodesOne.getEventListeners(0).length).to.equal(0);
  });

  it('event methods: no event binding', () => {
    const nodesOne = new Nodes(element);
    nodesOne.off();
    expect(nodesOne.getEventListeners(0).length).to.equal(0);
  });

  it('attribute methods: single key', () => {
    const nodes = new Nodes([element, document.body]);
    nodes.attr('class', 'my-class');
    expect(nodes.attr('class')).to.equal('my-class');
    expect(nodes.eq(1).attr('class')).to.equal('my-class');
    expect(nodes.hasAttr('class')).to.equal(true);
    nodes.removeAttr('class');
    expect(nodes.attr('class')).to.equal('');
    expect(nodes.eq(1).attr('class')).to.equal('');
    expect(nodes.hasAttr('class')).to.equal(false);
  });

  it('attribute methods: multi-key', () => {
    const nodes = new Nodes([element, document.body]);
    nodes.attr({
      id: 'my-id',
      class: 'my-class',
      'data-one': 'my-data-one',
    });
    expect(nodes.attr('id')).to.equal('my-id');
    expect(nodes.attr('class')).to.equal('my-class');
    expect(nodes.attr('data-one')).to.equal('my-data-one');
    nodes.attr({
      id: 'my-id',
      class: 'my-class',
      'data-one': 'my-data-one',
    });
    expect(nodes.attr('id')).to.equal('my-id');
    expect(nodes.attr('class')).to.equal('my-class');
    expect(nodes.attr('data-one')).to.equal('my-data-one');
    expect(nodes.hasAttr('data-one')).to.equal(true);
    nodes.removeAttr('id');
    nodes.removeAttr('class');
    nodes.removeAttr('data-one');
    expect(nodes.attr('id')).to.equal('');
    expect(nodes.attr('class')).to.equal('');
    expect(nodes.attr('data-one')).to.equal('');
    expect(nodes.hasAttr('data-one')).to.equal(false);
  });

  it('class methods: class name is a string', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.addClass('class-one');
    expect(nodes.hasClass('class-one')).to.equal(true);
    expect(nodes.eq(1).hasClass('class-one')).to.equal(true);
    nodes.addClass('class-two');
    expect(nodes.hasClass('class-two')).to.equal(true);
    expect(nodes.eq(1).hasClass('class-two')).to.equal(true);
    nodes.removeClass('class-one');
    expect(nodes.hasClass('class-one')).to.equal(false);
    expect(nodes.hasClass('class-two')).to.equal(true);
    nodes.removeClass('class-two');
    expect(nodes.hasClass('class-one')).to.equal(false);
    expect(nodes.hasClass('class-two')).to.equal(false);
    expect(nodes.hasAttr('class')).to.equal(false);
  });

  it('class methods: class name is an array', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.addClass(['class-one', 'class-two']);
    expect(nodes.hasClass('class-one')).to.equal(true);
    expect(nodes.hasClass('class-two')).to.equal(true);
    expect(nodes.eq(1).hasClass('class-one')).to.equal(true);
    expect(nodes.eq(1).hasClass('class-two')).to.equal(true);
    nodes.removeClass(['class-one', 'class-two']);
    expect(nodes.hasClass('class-one')).to.equal(false);
    expect(nodes.hasClass('class-two')).to.equal(false);
    expect(nodes.eq(1).hasClass('class-one')).to.equal(false);
    expect(nodes.eq(1).hasClass('class-two')).to.equal(false);
  });

  it('css methods: property name is string', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.css('background-color', '#ff0000');
    nodes.css('border', '1px solid #0000ff');
    expect(nodes.css('background-color')).to.equal('#ff0000');
    expect(nodes.eq(1).css('background-color')).to.equal('#ff0000');
    expect(nodes.css('border-color')).to.equal('#0000ff');
    nodes.css('background-color', '');
    nodes.css('border', '');
    expect(nodes.css('background-color')).to.equal('#000000');
    expect(nodes.eq(1).css('background-color')).to.equal('#000000');
    expect(nodes.css('border-color')).to.equal('#000000');
  });

  it('css methods: property name is array', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.css({
      'background-color': '#ff0000',
      'border': '1px solid #0000ff',
    });
    expect(nodes.css('background-color')).to.equal('#ff0000');
    expect(nodes.eq(1).css('background-color')).to.equal('#ff0000');
    expect(nodes.css('border-color')).to.equal('#0000ff');
  });

  it('method: html', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.html('<p>foo</p>');
    expect(nodes.html()).to.equal('<p>foo</p>');
    expect(nodes.eq(1).html()).to.equal('<p>foo</p>');
  });

  it('method: empty', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.html('<p>foo</p>');
    nodes.empty();
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('');
  });

  it('method: prepend', () => {
    const nodes = new Nodes([element, elementTwo]);
    // prepends string
    nodes.prepend('<p>foo</p>');
    expect(nodes.html()).to.equal('<p>foo</p>one');
    expect(nodes.eq(1).html()).to.equal('<p>foo</p>two');
    // prepends native node
    nodes.empty();
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>foo</strong>bar';
    nodes.prepend(newElement1);
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
    // prepends Nodes
    nodes.empty();
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>foo</strong>bar';
    const newNodes = new Nodes(newElement2);
    nodes.prepend(newNodes);
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
  });

  it('method: append', () => {
    const nodes = new Nodes([element, elementTwo]);
    // appends string
    nodes.append('<p>foo</p>');
    expect(nodes.html()).to.equal('one<p>foo</p>');
    expect(nodes.eq(1).html()).to.equal('two<p>foo</p>');
    // appends native node
    nodes.empty();
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>foo</strong>bar';
    nodes.append(newElement1);
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
    // appends Nodes
    nodes.empty();
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>foo</strong>bar';
    const newNodes = new Nodes(newElement2);
    nodes.append(newNodes);
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
  });

  it('method: appendTo', () => {
    const elem1 = document.createElement('p');
    elem1.innerHTML = '<strong>foo</strong>bar';
    const elem2 = document.createElement('p');
    elem2.innerHTML = '<strong>foo2</strong>bar2';
    const nodes1 = new Nodes([elem1, elem2]);
    // appends to selector string
    const targetContainer = document.createElement('div');
    targetContainer.innerHTML = '<div class="class-div">one</div><div class="class-div">two</div>';
    document.body.appendChild(targetContainer);
    nodes1.appendTo('.class-div');
    expect(targetContainer.innerHTML).to.equal('<div class="class-div">one</div><div class="class-div">two<p><strong>foo</strong>bar</p><p><strong>foo2</strong>bar2</p></div>');
    document.body.removeChild(targetContainer);
    // appends to native node
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>foo</strong>bar';
    new Nodes(newElement1).appendTo(element);
    expect(element.innerHTML).to.equal('one<p><strong>foo</strong>bar</p>');
    // appends to Nodes
    element.innerHTML = 'one';
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>foo</strong>bar';
    const targetNodes = new Nodes(element);
    new Nodes(newElement2).appendTo(targetNodes);
    expect(targetNodes.html()).to.equal('one<p><strong>foo</strong>bar</p>');
  });

  it('method: remove', () => {
    const nodes = new Nodes([element, elementTwo]);
    // remove all
    nodes.html('<p><strong>foo1</strong>bar1</p><p><strong>foo2</strong>bar2</p>');
    new Nodes(nodes.get(0).firstChild as NativeElement).remove();
    expect(nodes.eq(0).html()).to.equal('<p><strong>foo2</strong>bar2</p>');
    // keep children
    nodes.html('<p><strong>foo1</strong>bar1</p><p><strong>foo2</strong>bar2</p>');
    new Nodes(nodes.get(0).firstChild as NativeElement).remove(true);
    expect(nodes.eq(0).html()).to.equal('<strong>foo1</strong>bar1<p><strong>foo2</strong>bar2</p>');
    // no parent
    const elem = document.createElement('div');
    const elemList = new Nodes(elem);
    const elemId = elemList.id(0);
    elemList.remove();
    expect(elemList.id(0)).to.equal(elemId);
    expect(elemList.get(0)).to.equal(elem);
  });
});
