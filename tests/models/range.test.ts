import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes, Range } from '../../src/models';

describe('models.Range class', () => {

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

  it('property: commonAncestor', () => {
    const range = new Range();
    range.selectNode(element1.find('strong'));
    expect(range.commonAncestor.html()).to.equal('<strong>foo1</strong>bar1');
  });

  it('method: setStart', () => {
    const range = new Range();
    const nodes = element1.find('strong').first();
    range.setStart(nodes, 1);
    expect(range.startNode.get(0)).to.equal(nodes.get(0));
    expect(range.startOffset).to.equal(1);
  });

  it('method: setEnd', () => {
    const range = new Range();
    const nodes = element1.find('strong').first();
    range.setEnd(nodes, 1);
    expect(range.endNode.get(0)).to.equal(nodes.get(0));
    expect(range.endOffset).to.equal(1);
  });

  it('method: collapse', () => {
    const range = new Range();
    const nodes = element1.find('strong').first();
    range.setStart(nodes, 1);
    range.setEnd(nodes, 2);
    expect(range.collapsed).to.equal(false);
    range.collapse(true);
    expect(range.collapsed).to.equal(true);
    expect(range.endNode.get(0)).to.equal(nodes.get(0));
    expect(range.endOffset).to.equal(1);
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

  it('insertNode method: insert an element', () => {
    const range = new Range();
    const strong = element1.find('strong');
    const textNode = strong.first();
    range.setStart(textNode, 1);
    range.setEnd(textNode, 2);
    const em = query('<em>insert node</em>');
    range.insertNode(em);
    expect(range.startNode.get(0)).to.equal(strong.get(0));
    expect(range.endNode.get(0)).to.equal(strong.get(0));
    expect(range.startOffset).to.equal(1);
    expect(range.endOffset).to.equal(1);
    expect(range.collapsed).to.equal(true);
    expect(strong.html()).to.equal('f<em>insert node</em>oo1');
  });

  it('insertNode method: insert multi-element', () => {
    const range = new Range();
    const strong = element1.find('strong');
    const textNode = strong.first();
    range.setStart(textNode, 1);
    range.setEnd(textNode, 2);
    const nodes = query('<em>insert node</em><span>insert node</span>');
    range.insertNode(nodes);
    expect(range.startNode.get(0)).to.equal(strong.get(0));
    expect(range.endNode.get(0)).to.equal(strong.get(0));
    expect(range.startOffset).to.equal(1);
    expect(range.endOffset).to.equal(1);
    expect(range.collapsed).to.equal(true);
    expect(strong.html()).to.equal('f<em>insert node</em><span>insert node</span>oo1');
  });
});
