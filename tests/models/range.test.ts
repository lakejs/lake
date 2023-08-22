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

  it('method: setStartBefore', () => {
    const range = new Range();
    const node = container.find('strong');
    range.setStartBefore(node);
    expect(range.startNode.get(0)).to.equal(node.parent().get(0));
    expect(range.startOffset).to.equal(0);
  });

  it('method: setStartAfter', () => {
    const range = new Range();
    const node = container.find('strong');
    range.setStartAfter(node);
    expect(range.startNode.get(0)).to.equal(node.parent().get(0));
    expect(range.startOffset).to.equal(1);
  });

  it('method: setEnd', () => {
    const range = new Range();
    const nodes = container.find('strong').first();
    range.setEnd(nodes, 1);
    expect(range.endNode.get(0)).to.equal(nodes.get(0));
    expect(range.endOffset).to.equal(1);
  });

  it('method: setEndBefore', () => {
    const range = new Range();
    const node = container.find('strong');
    range.setEndBefore(node);
    expect(range.endNode.get(0)).to.equal(node.parent().get(0));
    expect(range.endOffset).to.equal(0);
  });

  it('method: setEndAfter', () => {
    const range = new Range();
    const node = container.find('strong');
    range.setEndAfter(node);
    expect(range.endNode.get(0)).to.equal(node.parent().get(0));
    expect(range.endOffset).to.equal(1);
  });

  it('method: collapseToStart', () => {
    const range = new Range();
    const nodes = container.find('strong').first();
    range.setStart(nodes, 1);
    range.setEnd(nodes, 2);
    expect(range.isCollapsed).to.equal(false);
    range.collapseToStart();
    expect(range.isCollapsed).to.equal(true);
    expect(range.endNode.get(0)).to.equal(nodes.get(0));
    expect(range.endOffset).to.equal(1);
  });

  it('method: collapseToEnd', () => {
    const range = new Range();
    const nodes = container.find('strong').first();
    range.setStart(nodes, 1);
    range.setEnd(nodes, 2);
    expect(range.isCollapsed).to.equal(false);
    range.collapseToEnd();
    expect(range.isCollapsed).to.equal(true);
    expect(range.endNode.get(0)).to.equal(nodes.get(0));
    expect(range.endOffset).to.equal(2);
  });

  it('method: selectNode', () => {
    const range = new Range();
    range.selectNode(container.find('strong'));
    expect(range.startNode.name).to.equal('div');
    expect(range.endNode.name).to.equal('div');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(false);
  });

  it('method: selectNodeContents', () => {
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    expect(range.startNode.name).to.equal('strong');
    expect(range.endNode.name).to.equal('strong');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(false);
  });

  it('method: containsNode', () => {
    container.html('<p>outer start</p><p>foo<strong>bold</strong></p><h1>heading</h1><p><em>itelic</em>bar</p><p>outer end</p>');
    const range = new Range();
    range.setStart(container.find('strong').prev(), 1);
    range.setEnd(container.find('em').next(), 2);
    expect(range.containsNode(container.find('strong'))).to.equal(true);
    expect(range.containsNode(container.find('p').eq(0))).to.equal(false);
  });

  it('method: allNodes', () => {
    container.html('<p>outer start</p><p>foo<strong>bold</strong></p><h1>heading</h1><p><em>itelic</em>bar</p><p>outer end</p>');
    const range = new Range();
    range.setStart(container.find('strong').prev(), 1);
    range.setEnd(container.find('em').next(), 2);
    const nodes = range.allNodes();
    expect(nodes.length).to.equal(10);
    expect(nodes[0].name).to.equal('p');
    expect(nodes[2].name).to.equal('strong');
    expect(nodes[4].name).to.equal('h1');
    expect(nodes[7].name).to.equal('em');
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
    expect(range.isCollapsed).to.equal(true);
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
    expect(range.isCollapsed).to.equal(true);
    expect(strong.html()).to.equal('f<em>insert node</em><span>insert node</span>oo');
  });
});
