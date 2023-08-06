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


});
