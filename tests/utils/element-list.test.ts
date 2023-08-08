import { expect } from 'chai';
import { ElementList } from '../../src/utils';

describe('ElementList of utils', () => {

  let element: Element;
  let elementTwo: Element;

  before(() => {
    element = document.createElement('div');
    element.innerHTML = 'one';
    document.body.appendChild(element);
    elementTwo = document.createElement('p');
    elementTwo.innerHTML = 'two';
    document.body.appendChild(elementTwo);
  });

  after(() => {
    document.body.removeChild(element);
    document.body.removeChild(elementTwo);
  });

  it('property: length', () => {
    expect(new ElementList(element).length).to.equal(1);
    expect(new ElementList([element, document.body]).length).to.equal(2);
  });

  it('property: doc', () => {
    expect(new ElementList(element).doc).to.equal(document);
  });

  it('property: win', () => {
    expect(new ElementList(element).win).to.equal(window);
  });

  it('method: get', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    expect(elementList.get(1).innerHTML).to.equal('two');
  });

  it('method: eq', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    expect(elementList.eq(2).name()).to.equal('body');
  });

  it('method: id', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    expect(elementList.id()).to.be.a('number');
    expect(elementList.id(0)).to.be.a('number');
    expect(elementList.id(1)).to.be.a('number');
  });

  it('method: name', () => {
    const elementList = new ElementList([element, elementTwo, document.body]);
    expect(elementList.name()).to.equal('div');
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
    expect(elementList.getEventListeners().length).to.equal(1);
    expect(elementList.getEventListeners()[0].type).to.equal('click');
    expect(elementList.getEventListeners()[0].callback).to.equal(listener);
    expect(elementList.getEventListeners(1).length).to.equal(1);
    expect(elementList.getEventListeners(1)[0].type).to.equal('click');
    expect(elementList.getEventListeners(1)[0].callback).to.equal(listener);
    // remove an event
    const offResult = elementList.off('click', listener);
    expect(offResult).to.equal(elementList);
    expect(elementList.getEventListeners().length).to.equal(0);
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
    expect(elementList.getEventListeners().length).to.equal(3);
    expect(elementList.getEventListeners()[0].type).to.equal('click');
    expect(elementList.getEventListeners()[1].type).to.equal('mousedown');
    expect(elementList.getEventListeners()[2].type).to.equal('mouseup');
    // remove an event
    elementList.off('mousedown');
    expect(elementList.getEventListeners().length).to.equal(2);
    expect(elementList.getEventListeners()[0].type).to.equal('click');
    expect(elementList.getEventListeners()[1].type).to.equal('mouseup');
    elementList.fire('mousedown');
    expect(element.innerHTML).to.equal('one');
    // remove all events
    elementList.off();
    expect(elementList.getEventListeners().length).to.equal(0);
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
    expect(elementListOne.getEventListeners().length).to.equal(0);

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
});
