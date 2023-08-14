import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes, Range } from '../../src/models';

describe('models.Range class', () => {

  let container: Nodes;

  beforeEach(() => {
    container = query('<div><strong>foo</strong>bar</div>').appendTo(document.body);
  });

  afterEach(() => {
    container.remove();
  });

  it('property: commonAncestor', () => {
    const range = new Range();
    range.selectNode(container.find('strong'));
    expect(range.commonAncestor.html()).to.equal('<strong>foo</strong>bar');
  });

  it('method: setStart', () => {
    const range = new Range();
    const nodes = container.find('strong').first();
    range.setStart(nodes, 1);
    expect(range.startNode.get(0)).to.equal(nodes.get(0));
    expect(range.startOffset).to.equal(1);
  });

  it('method: setEnd', () => {
    const range = new Range();
    const nodes = container.find('strong').first();
    range.setEnd(nodes, 1);
    expect(range.endNode.get(0)).to.equal(nodes.get(0));
    expect(range.endOffset).to.equal(1);
  });

  it('method: collapse', () => {
    const range = new Range();
    const nodes = container.find('strong').first();
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
    range.selectNode(container.find('strong'));
    expect(range.startNode.name(0)).to.equal('div');
    expect(range.endNode.name(0)).to.equal('div');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.collapsed).to.equal(false);
  });

  it('method: selectNodeContents', () => {
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    expect(range.startNode.name(0)).to.equal('strong');
    expect(range.endNode.name(0)).to.equal('strong');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.collapsed).to.equal(false);
  });

  it('insertNode method: insert an container', () => {
    const range = new Range();
    const strong = container.find('strong');
    const textNode = strong.first();
    range.setStart(textNode, 1);
    range.setEnd(textNode, 2);
    const em = query('<em>insert node</em>');
    range.insertNode(em);
    expect(range.startNode.get(0)).to.equal(strong.get(0));
    expect(range.endNode.get(0)).to.equal(strong.get(0));
    expect(range.startOffset).to.equal(2);
    expect(range.endOffset).to.equal(2);
    expect(range.collapsed).to.equal(true);
    expect(strong.html()).to.equal('f<em>insert node</em>oo');
  });

  it('insertNode method: insert multi-container', () => {
    const range = new Range();
    const strong = container.find('strong');
    const textNode = strong.first();
    range.setStart(textNode, 1);
    range.setEnd(textNode, 2);
    const nodes = query('<em>insert node</em><span>insert node</span>');
    range.insertNode(nodes);
    expect(range.startNode.get(0)).to.equal(strong.get(0));
    expect(range.endNode.get(0)).to.equal(strong.get(0));
    expect(range.startOffset).to.equal(3);
    expect(range.endOffset).to.equal(3);
    expect(range.collapsed).to.equal(true);
    expect(strong.html()).to.equal('f<em>insert node</em><span>insert node</span>oo');
  });
});
