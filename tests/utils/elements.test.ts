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

  it('elements.name()', () => {
    expect(new Elements(element).name()).to.equal('div');
  });

  it('elements.get()', () => {
    const elements = new Elements([element, elementTwo, document.body]);
    expect(elements.get(2).name()).to.equal('body');
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
    expect(elements.events.length).to.equal(2);
    // bind an event
    const onResult = elements.on('click', listener);
    expect(onResult).to.equal(elements);
    expect(elements.events[0].length).to.equal(1);
    expect(elements.events[0][0].type).to.equal('click');
    expect(elements.events[0][0].callback).to.equal(listener);
    expect(elements.events[1].length).to.equal(1);
    expect(elements.events[1][0].type).to.equal('click');
    expect(elements.events[1][0].callback).to.equal(listener);
    // remove an event
    const offResult = elements.off('click', listener);
    expect(offResult).to.equal(elements);
    expect(elements.events[0].length).to.equal(0);
    expect(elements.events[1].length).to.equal(0);
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
    expect(elements.events[0].length).to.equal(3);
    expect(elements.events[0][0].type).to.equal('click');
    expect(elements.events[0][1].type).to.equal('mousedown');
    expect(elements.events[0][2].type).to.equal('mouseup');
    // remove an event
    elements.off('mousedown');
    expect(elements.events[0].length).to.equal(2);
    expect(elements.events[0][0].type).to.equal('click');
    expect(elements.events[0][1].type).to.equal('mouseup');
    // remove all events
    elements.off();
    expect(elements.events[0].length).to.equal(0);
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
