import { expect } from 'chai';
import { query, Nodes, Range } from '../../src/models';

describe('Range of models', () => {

  let element1: Nodes;
  let element2: Nodes;

  beforeEach(() => {
    element1 = query('<div><strong>foo1</strong>bar1</div>').appendTo(document.body);
    element2 = query('<div><strong>foo2</strong>bar2</div>').appendTo(document.body);
  });

  afterEach(() => {
    element1.remove();
    element2.remove();
  });

  it('method: selectNode', () => {
    const range = new Range();
    range.selectNode(element1.find('strong'));
    expect(range.startNode.name(0)).to.equal('div');
    expect(range.endNode.name(0)).to.equal('div');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.collapsed).to.equal(false);
  });

  it('method: selectNodeContents', () => {
    const range = new Range();
    range.selectNodeContents(element1.find('strong'));
    expect(range.startNode.name(0)).to.equal('strong');
    expect(range.endNode.name(0)).to.equal('strong');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.collapsed).to.equal(false);
  });
});
