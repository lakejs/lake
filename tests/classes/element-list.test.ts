import { expect } from 'chai';
import { ElementList } from '../../src/classes';

describe('ElementList of classes', () => {

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
    expect(new ElementList(element).length).to.equal(1);
    expect(new ElementList([element, document.body]).length).to.equal(2);
  });

  it('method: get', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    expect(elementList.get(1).innerHTML).to.equal('two');
  });

  it('method: getAll', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    expect(elementList.getAll().length).to.equal(3);
    expect(elementList.getAll()[1].innerHTML).to.equal('two');
  });

  it('method: eq', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    expect(elementList.eq(2).name(0)).to.equal('body');
  });

  it('method: id', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    expect(elementList.id(0)).to.be.a('number');
    expect(elementList.id(1)).to.be.a('number');
  });

  it('method: name', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    expect(elementList.name(0)).to.equal('div');
    expect(elementList.name(1)).to.equal('p');
  });

  it('method: each', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    let firstElement: any;
    let secondElement: any;
    let thirdElement: any;
    const result = elementList.each((element, index) => {
      if (index === 0) {
        firstElement = element;
        return;
      }
      if (index === 1) {
        secondElement = element;
        return false;
      }
      if (index === 2) {
        thirdElement = element;
      }
    });
    expect(result).to.equal(elementList);
    expect(firstElement).to.equal(element);
    expect(secondElement).to.equal(elementTwo);
    expect(thirdElement).to.equal(undefined);
  });

  it('event methods: to add an event', () => {
    const elementList = new ElementList([element, document.body]);
    const listener = () => {
      element.innerHTML = 'click event';
    };
    // bind an event
    const onResult = elementList.on('click', listener);
    expect(onResult).to.equal(elementList);
    expect(elementList.getEventListeners(0).length).to.equal(1);
    expect(elementList.getEventListeners(0)[0].type).to.equal('click');
    expect(elementList.getEventListeners(0)[0].listener).to.equal(listener);
    expect(elementList.getEventListeners(1).length).to.equal(1);
    expect(elementList.getEventListeners(1)[0].type).to.equal('click');
    expect(elementList.getEventListeners(1)[0].listener).to.equal(listener);
    // remove an event
    const offResult = elementList.off('click', listener);
    expect(offResult).to.equal(elementList);
    expect(elementList.getEventListeners(0).length).to.equal(0);
    expect(elementList.getEventListeners(1).length).to.equal(0);
  });

  it('event methods: to add multi-event', () => {
    const elementList = new ElementList([element, document.body]);
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
    elementList.on('click', clickListener);
    elementList.on('mousedown', mousedownListener);
    elementList.on('mouseup', mouseupListener);
    expect(elementList.getEventListeners(0).length).to.equal(3);
    expect(elementList.getEventListeners(0)[0].type).to.equal('click');
    expect(elementList.getEventListeners(0)[1].type).to.equal('mousedown');
    expect(elementList.getEventListeners(0)[2].type).to.equal('mouseup');
    // remove an event
    elementList.off('mousedown');
    expect(elementList.getEventListeners(0).length).to.equal(2);
    expect(elementList.getEventListeners(0)[0].type).to.equal('click');
    expect(elementList.getEventListeners(0)[1].type).to.equal('mouseup');
    elementList.fire('mousedown');
    expect(element.innerHTML).to.equal('one');
    // remove all events
    elementList.off();
    expect(elementList.getEventListeners(0).length).to.equal(0);
    elementList.fire('click');
    elementList.fire('mouseup');
    expect(element.innerHTML).to.equal('one');
  });

  it('event methods: to add multi-event that includes the same type', () => {
    const elementList = new ElementList(element);
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
    elementList.on('click', clickListenerOne);
    elementList.on('click', clickListenerTwo);
    elementList.on('mousedown', mousedownListener);
    expect(element.innerHTML).to.equal('one');
    elementList.fire('click');
    expect(element.innerHTML).to.equal('click event two');
    elementList.fire('click');
    expect(clickCount).to.equal(4);
    elementList.fire('mousedown');
    expect(element.innerHTML).to.equal('mousedown event');
    // remove all events
    elementList.off();
  });

  it('event methods: an element with multi-element-instance', () => {
    const elementListOne = new ElementList(element);
    let clickCount = 0;
    const clickListenerOne = () => {
      element.innerHTML = 'click event one';
      clickCount++;
    };
    const clickListenerTwo = () => {
      element.innerHTML = 'click event two';
      clickCount++;
    };
    const elementListTwo = new ElementList(element);
    // bind events
    elementListOne.on('click', clickListenerOne);
    elementListOne.on('click', clickListenerTwo);
    elementListTwo.fire('click');
    expect(element.innerHTML).to.equal('click event two');
    elementListTwo.fire('click');
    expect(clickCount).to.equal(4);
    // remove all events
    elementListTwo.off();
    expect(elementListOne.getEventListeners(0).length).to.equal(0);

  });

  it('attribute methods: single key', () => {
    const elementList = new ElementList([element, document.body]);
    elementList.attr('class', 'my-class');
    expect(elementList.attr('class')).to.equal('my-class');
    expect(elementList.eq(1).attr('class')).to.equal('my-class');
    expect(elementList.hasAttr('class')).to.equal(true);
    elementList.removeAttr('class');
    expect(elementList.attr('class')).to.equal('');
    expect(elementList.eq(1).attr('class')).to.equal('');
    expect(elementList.hasAttr('class')).to.equal(false);
  });

  it('attribute methods: multi-key', () => {
    const elementList = new ElementList([element, document.body]);
    elementList.attr({
      id: 'my-id',
      class: 'my-class',
      'data-one': 'my-data-one',
    });
    expect(elementList.attr('id')).to.equal('my-id');
    expect(elementList.attr('class')).to.equal('my-class');
    expect(elementList.attr('data-one')).to.equal('my-data-one');
    elementList.attr({
      id: 'my-id',
      class: 'my-class',
      'data-one': 'my-data-one',
    });
    expect(elementList.attr('id')).to.equal('my-id');
    expect(elementList.attr('class')).to.equal('my-class');
    expect(elementList.attr('data-one')).to.equal('my-data-one');
    expect(elementList.hasAttr('data-one')).to.equal(true);
    elementList.removeAttr('id');
    elementList.removeAttr('class');
    elementList.removeAttr('data-one');
    expect(elementList.attr('id')).to.equal('');
    expect(elementList.attr('class')).to.equal('');
    expect(elementList.attr('data-one')).to.equal('');
    expect(elementList.hasAttr('data-one')).to.equal(false);
  });

  it('class methods: class name is a string', () => {
    const elementList = new ElementList([element, elementTwo]);
    elementList.addClass('class-one');
    expect(elementList.hasClass('class-one')).to.equal(true);
    expect(elementList.eq(1).hasClass('class-one')).to.equal(true);
    elementList.addClass('class-two');
    expect(elementList.hasClass('class-two')).to.equal(true);
    expect(elementList.eq(1).hasClass('class-two')).to.equal(true);
    elementList.removeClass('class-one');
    expect(elementList.hasClass('class-one')).to.equal(false);
    expect(elementList.hasClass('class-two')).to.equal(true);
    elementList.removeClass('class-two');
    expect(elementList.hasClass('class-one')).to.equal(false);
    expect(elementList.hasClass('class-two')).to.equal(false);
    expect(elementList.hasAttr('class')).to.equal(false);
  });

  it('class methods: class name is an array', () => {
    const elementList = new ElementList([element, elementTwo]);
    elementList.addClass(['class-one', 'class-two']);
    expect(elementList.hasClass('class-one')).to.equal(true);
    expect(elementList.hasClass('class-two')).to.equal(true);
    expect(elementList.eq(1).hasClass('class-one')).to.equal(true);
    expect(elementList.eq(1).hasClass('class-two')).to.equal(true);
    elementList.removeClass(['class-one', 'class-two']);
    expect(elementList.hasClass('class-one')).to.equal(false);
    expect(elementList.hasClass('class-two')).to.equal(false);
    expect(elementList.eq(1).hasClass('class-one')).to.equal(false);
    expect(elementList.eq(1).hasClass('class-two')).to.equal(false);
  });

  it('css methods: property name is string', () => {
    const elementList = new ElementList([element, elementTwo]);
    elementList.css('background-color', '#ff0000');
    elementList.css('border', '1px solid #0000ff');
    expect(elementList.css('background-color')).to.equal('#ff0000');
    expect(elementList.eq(1).css('background-color')).to.equal('#ff0000');
    expect(elementList.css('border-color')).to.equal('#0000ff');
    elementList.css('background-color', '');
    elementList.css('border', '');
    expect(elementList.css('background-color')).to.equal('#000000');
    expect(elementList.eq(1).css('background-color')).to.equal('#000000');
    expect(elementList.css('border-color')).to.equal('#000000');
  });

  it('css methods: property name is array', () => {
    const elementList = new ElementList([element, elementTwo]);
    elementList.css({
      'background-color': '#ff0000',
      'border': '1px solid #0000ff',
    });
    expect(elementList.css('background-color')).to.equal('#ff0000');
    expect(elementList.eq(1).css('background-color')).to.equal('#ff0000');
    expect(elementList.css('border-color')).to.equal('#0000ff');
  });

  it('method: html', () => {
    const elementList = new ElementList([element, elementTwo]);
    elementList.html('<p>foo</p>');
    expect(elementList.html()).to.equal('<p>foo</p>');
    expect(elementList.eq(1).html()).to.equal('<p>foo</p>');
  });

  it('method: empty', () => {
    const elementList = new ElementList([element, elementTwo]);
    elementList.html('<p>foo</p>');
    elementList.empty();
    expect(elementList.html()).to.equal('');
    expect(elementList.eq(1).html()).to.equal('');
  });

  it('method: prepend', () => {
    const elementList = new ElementList([element, elementTwo]);
    // prepends string
    elementList.prepend('<p>foo</p>');
    expect(elementList.html()).to.equal('<p>foo</p>one');
    expect(elementList.eq(1).html()).to.equal('<p>foo</p>two');
    // prepends native node
    elementList.empty();
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>foo</strong>bar';
    elementList.prepend(newElement1);
    expect(elementList.html()).to.equal('');
    expect(elementList.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
    // prepends ElementList
    elementList.empty();
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>foo</strong>bar';
    const newElementList = new ElementList(newElement2);
    elementList.prepend(newElementList);
    expect(elementList.html()).to.equal('');
    expect(elementList.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
  });

  it('method: append', () => {
    const elementList = new ElementList([element, elementTwo]);
    // appends string
    elementList.append('<p>foo</p>');
    expect(elementList.html()).to.equal('one<p>foo</p>');
    expect(elementList.eq(1).html()).to.equal('two<p>foo</p>');
    // appends native node
    elementList.empty();
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>foo</strong>bar';
    elementList.append(newElement1);
    expect(elementList.html()).to.equal('');
    expect(elementList.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
    // appends ElementList
    elementList.empty();
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>foo</strong>bar';
    const newElementList = new ElementList(newElement2);
    elementList.append(newElementList);
    expect(elementList.html()).to.equal('');
    expect(elementList.eq(1).html()).to.equal('<p><strong>foo</strong>bar</p>');
  });

  it('method: appendTo', () => {
    const elem1 = document.createElement('p');
    elem1.innerHTML = '<strong>foo</strong>bar';
    const elem2 = document.createElement('p');
    elem2.innerHTML = '<strong>foo2</strong>bar2';
    const elementList1 = new ElementList([elem1, elem2]);
    // appends to selector string
    const targetContainer = document.createElement('div');
    targetContainer.innerHTML = '<div class="class-div">one</div><div class="class-div">two</div>';
    document.body.appendChild(targetContainer);
    elementList1.appendTo('.class-div');
    expect(targetContainer.innerHTML).to.equal('<div class="class-div">one</div><div class="class-div">two<p><strong>foo</strong>bar</p><p><strong>foo2</strong>bar2</p></div>');
    document.body.removeChild(targetContainer);
    // appends to native node
    const newElement1 = document.createElement('p');
    newElement1.innerHTML = '<strong>foo</strong>bar';
    new ElementList(newElement1).appendTo(element);
    expect(element.innerHTML).to.equal('one<p><strong>foo</strong>bar</p>');
    // appends to ElementList
    element.innerHTML = 'one';
    const newElement2 = document.createElement('p');
    newElement2.innerHTML = '<strong>foo</strong>bar';
    const targetElementList = new ElementList(element);
    new ElementList(newElement2).appendTo(targetElementList);
    expect(targetElementList.html()).to.equal('one<p><strong>foo</strong>bar</p>');
  });
});
