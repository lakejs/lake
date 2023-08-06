import { expect } from 'chai';
import { Nodes } from '../../src/utils';

describe('Nodes in utils', () => {

  let element: Element;
  let textNode: Text;

  before(() => {
    element = document.createElement('div');
    element.innerHTML = 'one';
    document.body.appendChild(element);
    textNode = document.createTextNode('two');
    document.body.appendChild(textNode);
  });

  after(() => {
    document.body.removeChild(element);
    document.body.removeChild(textNode);
  });

  it('nodes.length', () => {
    expect(new Nodes(element).length).to.equal(1);
    expect(new Nodes([element, document.body]).length).to.equal(2);
  });

  it('nodes.doc', () => {
    expect(new Nodes(element).doc).to.equal(document);
  });

  it('nodes.win', () => {
    expect(new Nodes(element).win).to.equal(window);
  });

  it('nodes.name', () => {
    expect(new Nodes(element).name).to.equal('div');
  });

  it('nodes.type', () => {
    expect(new Nodes(element).type).to.equal(Node.ELEMENT_NODE);
  });

  it('nodes.each()', () => {
    const nodes = new Nodes([element, textNode, document.body]);
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

  it('nodes.on() and nodes.off() - single event', () => {
    const nodes = new Nodes([element, document.body]);
    const listener = () => {
      element.innerHTML = 'click event';
    };
    expect(nodes.events.length).to.equal(2);
    // bind an event
    nodes.on('click', listener);
    expect(nodes.events[0].length).to.equal(1);
    expect(nodes.events[0][0].type).to.equal('click');
    expect(nodes.events[0][0].callback).to.equal(listener);
    expect(nodes.events[1].length).to.equal(1);
    expect(nodes.events[1][0].type).to.equal('click');
    expect(nodes.events[1][0].callback).to.equal(listener);
    // remove an event
    nodes.off('click', listener);
    expect(nodes.events[0].length).to.equal(0);
    expect(nodes.events[1].length).to.equal(0);
  });

  it('nodes.on() and nodes.off() - multiple events', () => {
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
    expect(nodes.events[0].length).to.equal(3);
    expect(nodes.events[0][0].type).to.equal('click');
    expect(nodes.events[0][1].type).to.equal('mousedown');
    expect(nodes.events[0][2].type).to.equal('mouseup');
    // remove an event
    nodes.off('mousedown');
    expect(nodes.events[0].length).to.equal(2);
    expect(nodes.events[0][0].type).to.equal('click');
    expect(nodes.events[0][1].type).to.equal('mouseup');
    // remove all events
    nodes.off();
    expect(nodes.events[0].length).to.equal(0);
  });
});
