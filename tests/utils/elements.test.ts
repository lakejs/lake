import { expect } from 'chai';
import { Elements } from '../../src/utils';

describe('Elements in utils', () => {

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

  it('elements.length', () => {
    expect(new Elements(element).length).to.equal(1);
    expect(new Elements([element, document.body]).length).to.equal(2);
  });

  it('elements.doc', () => {
    expect(new Elements(element).doc).to.equal(document);
  });

  it('elements.win', () => {
    expect(new Elements(element).win).to.equal(window);
  });

  it('elements.get()', () => {
    const elements = new Elements([element, elementTwo, document.body]);
    expect(elements.get(2).name()).to.equal('body');
  });

  it('elements.id()', () => {
    const elements = new Elements([element, elementTwo, document.body]);
    expect(elements.id()).to.be.a('number');
    expect(elements.id(0)).to.be.a('number');
    expect(elements.id(1)).to.be.a('number');
  });

  it('elements.name()', () => {
    const elements = new Elements([element, elementTwo, document.body]);
    expect(elements.name()).to.equal('div');
    expect(elements.name(0)).to.equal('div');
    expect(elements.name(1)).to.equal('p');
  });

  it('elements.each()', () => {
    const elements = new Elements([element, elementTwo, document.body]);
    let firstElement: any;
    let secondElement: any;
    let thirdElement: any;
    const result = elements.each((element, index) => {
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
    expect(result).to.equal(elements);
    expect(firstElement).to.equal(element);
    expect(secondElement).to.equal(elementTwo);
    expect(thirdElement).to.equal(undefined);
  });

  it('elements.on() and elements.off() : single event', () => {
    const elements = new Elements([element, document.body]);
    const listener = () => {
      element.innerHTML = 'click event';
    };
    // bind an event
    const onResult = elements.on('click', listener);
    expect(onResult).to.equal(elements);
    expect(elements.getEventListeners().length).to.equal(1);
    expect(elements.getEventListeners()[0].type).to.equal('click');
    expect(elements.getEventListeners()[0].callback).to.equal(listener);
    expect(elements.getEventListeners(1).length).to.equal(1);
    expect(elements.getEventListeners(1)[0].type).to.equal('click');
    expect(elements.getEventListeners(1)[0].callback).to.equal(listener);
    // remove an event
    const offResult = elements.off('click', listener);
    expect(offResult).to.equal(elements);
    expect(elements.getEventListeners().length).to.equal(0);
    expect(elements.getEventListeners(1).length).to.equal(0);
  });

  it('elements.on() and elements.off() : multiple events', () => {
    const elements = new Elements([element, document.body]);
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
    elements.on('click', clickListener);
    elements.on('mousedown', mousedownListener);
    elements.on('mouseup', mouseupListener);
    expect(elements.getEventListeners().length).to.equal(3);
    expect(elements.getEventListeners()[0].type).to.equal('click');
    expect(elements.getEventListeners()[1].type).to.equal('mousedown');
    expect(elements.getEventListeners()[2].type).to.equal('mouseup');
    // remove an event
    elements.off('mousedown');
    expect(elements.getEventListeners().length).to.equal(2);
    expect(elements.getEventListeners()[0].type).to.equal('click');
    expect(elements.getEventListeners()[1].type).to.equal('mouseup');
    elements.fire('mousedown');
    expect(element.innerHTML).to.equal('one');
    // remove all events
    elements.off();
    expect(elements.getEventListeners().length).to.equal(0);
    elements.fire('click');
    elements.fire('mouseup');
    expect(element.innerHTML).to.equal('one');
  });

  it('elements.fire() : multiple events', () => {
    const elements = new Elements(element);
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
    elements.on('click', clickListenerOne);
    elements.on('click', clickListenerTwo);
    elements.on('mousedown', mousedownListener);
    expect(element.innerHTML).to.equal('one');
    elements.fire('click');
    expect(element.innerHTML).to.equal('click event two');
    elements.fire('click');
    expect(clickCount).to.equal(4);
    elements.fire('mousedown');
    expect(element.innerHTML).to.equal('mousedown event');
    // remove all events
    elements.off();
  });

  it('elements.attr(): single key', () => {
    const elements = new Elements([element, document.body]);
    elements.attr('class', 'my-class');
    expect(elements.attr('class')).to.equal('my-class');
    expect(elements.get(1).attr('class')).to.equal('my-class');
    elements.removeAttr('class');
    expect(elements.attr('class')).to.equal('');
    expect(elements.get(1).attr('class')).to.equal('');
  });

  it('elements.attr() : multiple keys', () => {
    const elements = new Elements([element, document.body]);
    elements.attr({
      id: 'my-id',
      class: 'my-class',
      'data-one': 'my-data-one',
    });
    expect(elements.attr('id')).to.equal('my-id');
    expect(elements.attr('class')).to.equal('my-class');
    expect(elements.attr('data-one')).to.equal('my-data-one');
    elements.attr({
      id: 'my-id',
      class: 'my-class',
      'data-one': 'my-data-one',
    });
    expect(elements.attr('id')).to.equal('my-id');
    expect(elements.attr('class')).to.equal('my-class');
    expect(elements.attr('data-one')).to.equal('my-data-one');
    elements.removeAttr('id');
    elements.removeAttr('class');
    elements.removeAttr('data-one');
    expect(elements.attr('id')).to.equal('');
    expect(elements.attr('class')).to.equal('');
    expect(elements.attr('data-one')).to.equal('');
  });
});
