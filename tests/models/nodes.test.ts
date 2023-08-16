import { expect } from 'chai';
import { NativeElement } from '../../src/types/native';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models';

describe('models.Nodes class', () => {

  let element: Element;
  let elementTwo: Element;

  beforeEach(() => {
    element = document.createElement('div');
    element.className = 'class1';
    element.innerHTML = 'one';
    document.body.appendChild(element);
    elementTwo = document.createElement('p');
    elementTwo.innerHTML = 'two';
    elementTwo.className = 'class2';
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

  it('property: id', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.id).to.be.a('number');
    expect(nodes.eq(1).id).to.be.a('number');
  });

  it('property: name', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.name).to.equal('div');
    expect(nodes.eq(1).name).to.equal('p');
  });

  it('property: isElement', () => {
    const node = new Nodes(element);
    expect(node.isElement).to.equal(true);
  });

  it('property: isText', () => {
    const node = new Nodes(document.createTextNode('foo'));
    expect(node.isText).to.equal(true);
  });

  it('property: isBlock', () => {
    const node = new Nodes(element);
    expect(node.isBlock).to.equal(true);
  });

  it('property: isEditable', () => {
    const container = query('<div contenteditable="true"><p>foo</p></div>');
    expect(container.isEditable).to.equal(true);
    expect(container.find('p').isEditable).to.equal(true);
    expect(container.parent().isEditable).to.equal(false);
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

  it('method: eq', () => {
    const nodes = new Nodes([element, elementTwo, document.body]);
    expect(nodes.eq(2).name).to.equal('body');
  });

  it('method: each', () => {
    const textNode = document.createTextNode('foo');
    const nodes = new Nodes([element, textNode, elementTwo]);
    let firstNode;
    let secondNode;
    let thirdNode;
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

  it('method: reverse', () => {
    const node = new Nodes([element, elementTwo, document.body]).reverse();
    expect(node.get(0)).to.equal(document.body);
    expect(node.eq(1).html()).to.equal('two');
    expect(node.eq(2).html()).to.equal('one');
  });

  it('method: find', () => {
    const node = new Nodes(document.body);
    const targetNodes1 = node.find('.class1');
    expect(targetNodes1.html()).to.equal('one');
    const targetNodes2 = node.find('.class1, .class2');
    expect(targetNodes2.html()).to.equal('one');
    expect(targetNodes2.eq(1).html()).to.equal('two');
  });

  it('method: closest', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.find('p').closest('div').html()).to.equal('<p>foo</p><p>bar</p>');
  });

  it('method: parent', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.find('p').parent().get(0)).to.equal(element);
  });

  it('method: prev', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.find('p').eq(1).prev().html()).to.equal('foo');
  });

  it('method: next', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.find('p').eq(0).next().html()).to.equal('bar');
  });

  it('method: first', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.first().html()).to.equal('foo');
  });

  it('method: last', () => {
    const node = new Nodes(element);
    node.html('<p>foo</p><p>bar</p>');
    expect(node.last().html()).to.equal('bar');
  });

  it('method: allChildNodes', () => {
    const node = new Nodes(element);
    node.html('<p>foo<strong>bold</strong></p><p><em>itelic</em>bar</p>');
    const childNodes = node.allChildNodes();
    expect(childNodes.length).to.equal(8);
    expect(childNodes[0].name).to.equal('p');
    expect(childNodes[2].name).to.equal('strong');
    expect(childNodes[4].name).to.equal('p');
    expect(childNodes[5].name).to.equal('em');
  });

  it('event methods: an event', () => {
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

  it('event methods: multi-event', () => {
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

  it('event methods: multi-event with the same type', () => {
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

  it('class methods: a string', () => {
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
  });

  it('class methods: an array', () => {
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

  it('css methods: a string', () => {
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

  it('css methods: an array', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.css({
      'background-color': '#ff0000',
      'border': '1px solid #0000ff',
    });
    expect(nodes.css('background-color')).to.equal('#ff0000');
    expect(nodes.eq(1).css('background-color')).to.equal('#ff0000');
    expect(nodes.css('border-color')).to.equal('#0000ff');
  });

  it('method: show', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.show();
    expect(nodes.css('display')).to.equal('block');
    expect(nodes.eq(1).css('display')).to.equal('block');
    nodes.show('inline-block');
    expect(nodes.css('display')).to.equal('inline-block');
    expect(nodes.eq(1).css('display')).to.equal('inline-block');
  });

  it('method: hide', () => {
    const nodes = new Nodes([element, elementTwo]);
    nodes.hide();
    expect(nodes.css('display')).to.equal('none');
    expect(nodes.eq(1).css('display')).to.equal('none');
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
    // insert a HTML string
    nodes.prepend('<p>foo</p>');
    expect(nodes.html()).to.equal('<p>foo</p>one');
    expect(nodes.eq(1).html()).to.equal('<p>foo</p>two');
    nodes.empty();
    // insert a HTML string with multi-element
    nodes.html('foo');
    nodes.prepend('<p>multi-element-one</p>bar<p>multi-element-two</p>');
    expect(nodes.html()).to.equal('<p>multi-element-one</p>bar<p>multi-element-two</p>foo');
    expect(nodes.eq(1).html()).to.equal('<p>multi-element-one</p>bar<p>multi-element-two</p>foo');
    nodes.empty();
    // insert a native node
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>foo</strong>bar';
    nodes.prepend(newElement1);
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
    nodes.empty();
    // insert nodes
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>foo</strong>bar';
    const newNodes = new Nodes(newElement2);
    nodes.prepend(newNodes);
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
  });

  it('method: append', () => {
    const nodes = new Nodes([element, elementTwo]);
    // insert a HTML string
    nodes.append('<p>foo</p>');
    expect(nodes.html()).to.equal('one<p>foo</p>');
    expect(nodes.eq(1).html()).to.equal('two<p>foo</p>');
    nodes.empty();
    // insert a HTML string with multi-element
    nodes.html('foo');
    nodes.append('<p>multi-element-one</p>bar<p>multi-element-two</p>');
    expect(nodes.html()).to.equal('foo<p>multi-element-one</p>bar<p>multi-element-two</p>');
    expect(nodes.eq(1).html()).to.equal('foo<p>multi-element-one</p>bar<p>multi-element-two</p>');
    nodes.empty();
    // insert a native node
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>foo</strong>bar';
    nodes.append(newElement1);
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
    nodes.empty();
    // insert nodes
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>foo</strong>bar';
    const newNodes = new Nodes(newElement2);
    nodes.append(newNodes);
    expect(nodes.html()).to.equal('');
    expect(nodes.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
  });

  it('method: appendTo', () => {
    const elem1 = query('<p><strong>foo</strong>bar</p>').get(0);
    const elem2 = query('<p><strong>foo2</strong>bar2</p>').get(0);
    const nodes1 = new Nodes([elem1, elem2]);
    // append to a selector string
    const targetContainer = query('<div><div class="class-div">one</div><div class="class-div">two</div></div>').appendTo(document.body);
    nodes1.appendTo('.class-div');
    expect(targetContainer.html()).to.equal('<div class="class-div">one</div><div class="class-div">two<p><strong>foo</strong>bar</p><p><strong>foo2</strong>bar2</p></div>');
    targetContainer.remove();
    // append to a native node
    query('<p><strong>foo</strong>bar</p>').appendTo(element);
    expect(element.innerHTML).to.equal('one<p><strong>foo</strong>bar</p>');
    // append to nodes
    element.innerHTML = 'one';
    query('<p><strong>foo</strong>bar</p>').appendTo(element);
    expect(element.innerHTML).to.equal('one<p><strong>foo</strong>bar</p>');
  });

  it('method: after', () => {
    const nodes = new Nodes([element, elementTwo]);
    // insert a HTML string
    nodes.after('<div class="after-test">a HTML string</div>');
    expect(nodes.next().html()).to.equal('a HTML string');
    expect(nodes.eq(1).next().html()).to.equal('a HTML string');
    query('.after-test').remove();
    // insert a HTML string with multi-element
    nodes.after('<div class="after-test">multi-element-one</div><div class="after-test">multi-element-two</div>');
    expect(nodes.next().html()).to.equal('multi-element-one');
    expect(nodes.next().next().html()).to.equal('multi-element-two');
    query('.after-test').remove();
    // insert a native node
    const nativeElement = query('<div class="after-test">native node</div>').get(0);
    nodes.after(nativeElement);
    expect(nodes.eq(1).next().html()).to.equal('native node');
    query('.after-test').remove();
    // insert nodes
    const newNodes = query('<div class="after-test">nodes</div>');
    nodes.after(newNodes);
    expect(nodes.eq(1).next().html()).to.equal('nodes');
    query('.after-test').remove();
  });

  it('method: replaceWith', () => {
    const node = new Nodes(element);
    node.html('<p><strong>foo1</strong>bar1</p><p><strong>foo2</strong>bar2</p>');
    node.find('strong').eq(0).replaceWith('<em>itelic</em>');
    expect(node.html()).to.equal('<p><em>itelic</em>bar1</p><p><strong>foo2</strong>bar2</p>');
  });

  it('method: remove', () => {
    const node = new Nodes([element, elementTwo]);
    // remove all
    node.html('<p><strong>foo1</strong>bar1</p><p><strong>foo2</strong>bar2</p>');
    node.first().remove();
    expect(node.html()).to.equal('<p><strong>foo2</strong>bar2</p>');
    // keep children
    node.html('<p><strong>foo1</strong>bar1</p><p><strong>foo2</strong>bar2</p>');
    node.first().remove(true);
    expect(node.html()).to.equal('<strong>foo1</strong>bar1<p><strong>foo2</strong>bar2</p>');
    // no parent
    const elem = query('<div />');
    const elemId = elem.id;
    elem.remove();
    expect(elem.id).to.equal(elemId);
  });
});
