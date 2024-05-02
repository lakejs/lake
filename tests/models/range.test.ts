import { boxes } from '../../src/storage/boxes';
import { createContainer } from '../utils';
import { query, safeTemplate } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Range } from '../../src/models/range';
import { Box } from '../../src/models/box';

function setTestBox(block: Nodes) {
  const box = new Box('blockBox');
  block.empty();
  block.append(box.node);
  box.render();
}

describe('models / range', () => {

  let container: Nodes;

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
    container.remove();
  });

  it('property: startNode', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const node = container.find('strong').first();
    range.setStart(node, 1);
    expect(range.startNode.get(0)).to.equal(node.get(0));
  });

  it('property: startOffset', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const node = container.find('strong').first();
    range.setStart(node, 1);
    expect(range.startOffset).to.equal(1);
  });

  it('property: endNode', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const node = container.find('strong').first();
    range.setEnd(node, 1);
    expect(range.endNode.get(0)).to.equal(node.get(0));
  });

  it('property: endOffset', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const node = container.find('strong').first();
    range.setEnd(node, 1);
    expect(range.endOffset).to.equal(1);
  });

  it('property: commonAncestor', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    range.selectNode(container.find('strong'));
    expect(range.commonAncestor.html()).to.equal('<strong>foo</strong>bar');
  });

  it('property: isCollapsed', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    range.selectNode(container.find('strong'));
    expect(range.isCollapsed).to.equal(false);
    range.collapseToEnd();
    expect(range.isCollapsed).to.equal(true);
  });

  it('property: isBox', () => {
    setTestBox(container);
    const range = new Range();
    const boxNode = container.find('lake-box');
    range.selectNodeContents(boxNode.find('.lake-box-container'));
    expect(range.isBox).to.equal(true);
  });

  it('property: isBoxStart', () => {
    setTestBox(container);
    const range = new Range();
    const boxNode = container.find('lake-box');
    range.selectBoxStart(boxNode);
    expect(range.isBoxStart).to.equal(true);
    range.selectBoxEnd(boxNode);
    expect(range.isBoxStart).to.equal(false);
  });

  it('property: isBoxCenter', () => {
    setTestBox(container);
    const range = new Range();
    const boxNode = container.find('lake-box');
    range.selectBox(boxNode);
    expect(range.isBoxCenter).to.equal(true);
    range.setStart(boxNode.find('.lake-box-container'), 1);
    expect(range.isBoxCenter).to.equal(false);
    range.selectBoxStart(boxNode);
    expect(range.isBoxCenter).to.equal(false);
    range.selectBoxEnd(boxNode);
    expect(range.isBoxCenter).to.equal(false);
  });

  it('property: isBoxEnd', () => {
    setTestBox(container);
    const range = new Range();
    const boxNode = container.find('lake-box');
    range.selectBoxStart(boxNode);
    expect(range.isBoxEnd).to.equal(false);
    range.selectBoxEnd(boxNode);
    expect(range.isBoxEnd).to.equal(true);
  });

  it('property: isInsideBox', () => {
    setTestBox(container);
    const range = new Range();
    const boxNode = container.find('lake-box');
    range.selectBox(boxNode);
    expect(range.isInsideBox).to.equal(false);
    range.setStart(boxNode.find('.lake-box-container'), 1);
    expect(range.isInsideBox).to.equal(true);
    range.selectBoxStart(boxNode);
    expect(range.isInsideBox).to.equal(false);
    range.selectBoxEnd(boxNode);
    expect(range.isInsideBox).to.equal(false);
  });

  it('property: isInoperative', () => {
    container.html(safeTemplate`
    <table>
      <tr>
        <td>foo</td>
        <td>bar</td>
      </tr>
    </table>
    `);
    const range = new Range();
    range.selectNodeContents(container.find('td').eq(0));
    expect(range.isInoperative).to.equal(false);
    range.setStart(container.find('td').eq(0), 0);
    range.setEnd(container.find('td').eq(1), 1);
    range.debug();
    expect(range.isInoperative).to.equal(true);
    range.setStart(container.parent(), 0);
    range.collapseToStart();
    expect(range.isInoperative).to.equal(true);
  });

  it('method: get', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    expect(range.get().startContainer).to.equal(document);
  });

  it('method: getRect', () => {
    let rect;
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    //  expanded range
    range.setStart(container.find('strong'), 0);
    range.setEnd(container.find('strong'), 1);
    rect = range.getRect();
    expect(rect.width > 0).to.equal(true);
    expect(rect.height > 0).to.equal(true);
    // collapsed range (at the beginning of an element)
    range.setStart(container.find('strong'), 0);
    range.collapseToStart();
    rect = range.getRect();
    expect(rect.width).to.equal(1);
    expect(rect.height > 0).to.equal(true);
    // collapsed range (at the end of an element)
    range.setStart(container.find('strong'), 1);
    range.collapseToStart();
    rect = range.getRect();
    expect(rect.width).to.equal(1);
    expect(rect.height > 0).to.equal(true);
    // collapsed range (at the beginning of a text)
    range.setStart(container.find('strong').first(), 0);
    range.collapseToStart();
    rect = range.getRect();
    expect(rect.width).to.equal(1);
    expect(rect.height > 0).to.equal(true);
    // collapsed range (at the end of a text)
    range.setStart(container.find('strong').first(), 3);
    range.collapseToStart();
    rect = range.getRect();
    expect(rect.width).to.equal(1);
    expect(rect.height > 0).to.equal(true);
    // empty block
    container.html('<p></p>');
    range.setStart(container.find('p'), 0);
    range.collapseToStart();
    rect = range.getRect();
    expect(rect.width).to.equal(1);
    expect(rect.height > 0).to.equal(true);
  });

  it('method: comparePoint', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    range.selectNode(container.find('strong'));
    expect(range.comparePoint(container.find('strong'), 0)).to.equal(0);
    expect(range.comparePoint(container.find('strong').next(), 1)).to.equal(1);
    range.selectNode(container.find('strong').next());
    expect(range.comparePoint(container.find('strong'), 1)).to.equal(-1);
    expect(range.comparePoint(container, 0)).to.equal(-1);
    expect(range.comparePoint(container, 1)).to.equal(0);
    expect(range.comparePoint(container, 2)).to.equal(0);
    const fooTextNode = new Nodes(document.createTextNode('foo'));
    const barTextNode = new Nodes(document.createTextNode('bar'));
    container.empty();
    container.append(fooTextNode);
    container.append(barTextNode);
    range.setStartAfter(fooTextNode);
    range.collapseToStart();
    expect(range.comparePoint(fooTextNode, 3)).to.equal(-1);
  });

  it('method: compareBeforeNode', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    range.selectNode(container.find('strong'));
    range.collapseToEnd();
    expect(range.compareBeforeNode(container.find('strong'))).to.equal(-1);
    expect(range.compareBeforeNode(container.find('strong').next())).to.equal(1);
    range.selectNodeContents(container.find('strong'));
    expect(range.compareBeforeNode(container.find('strong'))).to.equal(-1);
    expect(range.compareBeforeNode(container.find('strong').first())).to.equal(0);
    expect(range.compareBeforeNode(container.find('strong').next())).to.equal(1);
  });

  it('method: compareAfterNode', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    range.selectNode(container.find('strong'));
    range.collapseToEnd();
    expect(range.compareAfterNode(container.find('strong'))).to.equal(0);
    expect(range.compareAfterNode(container.find('strong').next())).to.equal(1);
    range.selectNodeContents(container.find('strong'));
    expect(range.compareAfterNode(container.find('strong'))).to.equal(1);
    expect(range.compareAfterNode(container.find('strong').first())).to.equal(0);
    expect(range.compareAfterNode(container.find('strong').next())).to.equal(1);
    range.selectNode(container.find('strong').next());
    range.collapseToEnd();
    expect(range.compareAfterNode(container.find('strong'))).to.equal(-1);
    const fooTextNode = new Nodes(document.createTextNode('foo'));
    const barTextNode = new Nodes(document.createTextNode('bar'));
    container.empty();
    container.append(fooTextNode);
    container.append(barTextNode);
    range.setStartAfter(fooTextNode);
    range.collapseToStart();
    expect(range.compareAfterNode(fooTextNode)).to.equal(-1);
  });

  it('method: intersectsNode', () => {
    container.html('<p>outer start</p><p>foo<strong>bold</strong></p><h1>heading</h1><p><i>itelic</i>bar</p><p>outer end</p>');
    const range = new Range();
    range.setStart(container.find('strong').prev(), 1);
    range.setEnd(container.find('i').next(), 2);
    expect(range.intersectsNode(container.find('strong'))).to.equal(true);
    expect(range.intersectsNode(container.find('strong').first())).to.equal(true);
    expect(range.intersectsNode(container.find('strong').prev())).to.equal(true);
    expect(range.intersectsNode(container.find('i').next())).to.equal(true);
    expect(range.intersectsNode(container.find('p').eq(0))).to.equal(false);
    expect(range.intersectsNode(container.find('p').eq(0).first())).to.equal(false);
  });

  it('method: setStart', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const node = container.find('strong').first();
    range.setStart(node, 1);
    expect(range.startNode.get(0)).to.equal(node.get(0));
    expect(range.startOffset).to.equal(1);
  });

  it('method: setStartBefore', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const node = container.find('strong');
    range.setStartBefore(node);
    expect(range.startNode.get(0)).to.equal(node.parent().get(0));
    expect(range.startOffset).to.equal(0);
  });

  it('method: setStartAfter', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const node = container.find('strong');
    range.setStartAfter(node);
    expect(range.startNode.get(0)).to.equal(node.parent().get(0));
    expect(range.startOffset).to.equal(1);
  });

  it('method: setEnd', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const nodes = container.find('strong').first();
    range.setEnd(nodes, 1);
    expect(range.endNode.get(0)).to.equal(nodes.get(0));
    expect(range.endOffset).to.equal(1);
  });

  it('method: setEndBefore', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const node = container.find('strong');
    range.setEndBefore(node);
    expect(range.endNode.get(0)).to.equal(node.parent().get(0));
    expect(range.endOffset).to.equal(0);
  });

  it('method: setEndAfter', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    const node = container.find('strong');
    range.setEndAfter(node);
    expect(range.endNode.get(0)).to.equal(node.parent().get(0));
    expect(range.endOffset).to.equal(1);
  });

  it('method: collapseToStart', () => {
    container.html('<strong>foo</strong>bar');
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
    container.html('<strong>foo</strong>bar');
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
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    range.selectNode(container.find('strong'));
    expect(range.startNode.name).to.equal('div');
    expect(range.endNode.name).to.equal('div');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(false);
  });

  it('method: selectNodeContents', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    range.selectNodeContents(container.find('strong'));
    expect(range.startNode.name).to.equal('strong');
    expect(range.endNode.name).to.equal('strong');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(false);
  });

  it('method: selectBox', () => {
    setTestBox(container);
    const range = new Range();
    range.selectBox(container.find('lake-box'));
    expect(range.startNode.attr('class')).to.equal('lake-box-container');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
  });

  it('method: selectBoxStart', () => {
    setTestBox(container);
    const range = new Range();
    range.selectBoxStart(container.find('lake-box'));
    const node = new Nodes((range.startNode.get(0) as Element).nextElementSibling);
    expect(node.attr('class')).to.equal('lake-box-container');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
  });

  it('method: selectBoxEnd', () => {
    setTestBox(container);
    const range = new Range();
    range.selectBoxEnd(container.find('lake-box'));
    const node = new Nodes((range.startNode.get(0) as Element).previousElementSibling);
    expect(node.attr('class')).to.equal('lake-box-container');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
  });

  it('shrinkBefore method: non-block', () => {
    container.html('<p>foo<strong>bar</strong></p>');
    const range = new Range();
    range.shrinkBefore(container.find('strong'));
    expect(range.startNode.name).to.equal('strong');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
  });

  it('shrinkBefore method: block', () => {
    container.html('<blockquote><p>foo<strong>bar</strong></p></blockquote>');
    const range = new Range();
    range.shrinkBefore(container.find('blockquote'));
    expect(range.startNode.name).to.equal('p');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
  });

  it('shrinkBefore method: box', () => {
    setTestBox(container);
    const range = new Range();
    range.shrinkBefore(container.find('lake-box'));
    expect(range.isBoxStart).to.equal(true);
  });

  it('shrinkBefore method: box in the paragraph', () => {
    container.html('<p></p>');
    setTestBox(container.find('p'));
    const range = new Range();
    range.shrinkBefore(container.find('p'));
    expect(range.isBoxStart).to.equal(true);
  });

  it('shrinkAfter method: non-block', () => {
    container.html('<p>foo<strong>bar</strong></p>');
    const range = new Range();
    range.shrinkAfter(container.find('strong'));
    expect(range.startNode.name).to.equal('strong');
    expect(range.startOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(true);
  });

  it('shrinkAfter method: block', () => {
    container.html('<blockquote><p>foo<strong>bar</strong></p></blockquote>');
    const range = new Range();
    range.shrinkAfter(container.find('blockquote'));
    expect(range.startNode.name).to.equal('strong');
    expect(range.startOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(true);
  });

  it('shrinkAfter method: box', () => {
    setTestBox(container);
    const range = new Range();
    range.shrinkAfter(container.find('lake-box'));
    expect(range.isBoxEnd).to.equal(true);
  });

  it('shrinkAfter method: box in the paragraph', () => {
    container.html('<p></p>');
    setTestBox(container.find('p'));
    const range = new Range();
    range.shrinkAfter(container.find('p'));
    expect(range.isBoxEnd).to.equal(true);
  });

  it('shrink method: expanded range', () => {
    container.html('<div><p><strong>foo</strong></p></div>');
    const range = new Range();
    range.selectNode(container.find('p'));
    expect(range.startNode.name).to.equal('div');
    expect(range.endNode.name).to.equal('div');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(false);
    range.shrink();
    expect(range.startNode.name).to.equal('strong');
    expect(range.endNode.name).to.equal('strong');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(false);
  });

  it('shrink method: collapsed range', () => {
    container.html('<div><p><strong>foo</strong></p></div>');
    const range = new Range();
    range.selectNode(container.find('p'));
    range.collapseToStart();
    expect(range.startNode.name).to.equal('div');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
    range.shrink();
    expect(range.startNode.name).to.equal('strong');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
  });

  it('shrink method: empty tag', () => {
    container.html('<div><p><i><strong></strong></i></p></div>');
    const range = new Range();
    range.selectNode(container.find('p'));
    range.collapseToStart();
    expect(range.startNode.name).to.equal('div');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
    range.shrink();
    expect(range.startNode.name).to.equal('strong');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
  });

  it('shrink method: with box', () => {
    container.html('<div><p><strong>foo</strong></p></div>');
    const startBox = new Box('inlineBox');
    container.find('strong').prepend(startBox.node);
    startBox.render();
    const endBox = new Box('inlineBox');
    container.find('strong').append(endBox.node);
    endBox.render();
    const range = new Range();
    range.selectNode(container.find('p'));
    range.shrink();
    expect(range.startNode.name).to.equal('strong');
    expect(range.endNode.name).to.equal('strong');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(3);
    expect(range.isCollapsed).to.equal(false);
  });

  it('adaptBox method: should move out to the start strip of the box', () => {
    setTestBox(container);
    container.prepend('<p>foo</p>');
    container.append('<p>bar</p>');
    const range = new Range();
    range.setStartAfter(container.find('br').eq(0));
    range.collapseToStart();
    range.adaptBox();
    expect(range.startNode.name).to.equal('div');
    expect(range.endNode.name).to.equal('div');
    expect(range.startOffset).to.equal(1);
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(true);
  });

  it('adaptBox method: should move out to the end strip of the box', () => {
    setTestBox(container);
    container.prepend('<p>foo</p>');
    container.append('<p>bar</p>');
    const range = new Range();
    range.setStartAfter(container.find('br').eq(1));
    range.collapseToStart();
    range.adaptBox();
    expect(range.startNode.name).to.equal('div');
    expect(range.endNode.name).to.equal('div');
    expect(range.startOffset).to.equal(2);
    expect(range.endOffset).to.equal(2);
    expect(range.isCollapsed).to.equal(true);
  });

  it('adaptBox method: should move out to either side of the box', () => {
    setTestBox(container);
    container.prepend('<p>foo</p>');
    container.append('<p>bar</p>');
    const range = new Range();
    range.setStartAfter(container.find('br').eq(0));
    range.setEndAfter(container.find('br').eq(1));
    range.adaptBox();
    expect(range.startNode.name).to.equal('div');
    expect(range.endNode.name).to.equal('div');
    expect(range.startOffset).to.equal(1);
    expect(range.endOffset).to.equal(2);
    expect(range.isCollapsed).to.equal(false);
  });

  it('adaptBox method: should move out to the start strip of the table', () => {
    container.prepend('<p>bar</p>');
    container.append('<table><tr><td>foo</td></tr></table>');
    const range = new Range();
    range.setStart(container.find('p'), 0);
    range.setEnd(container.find('td'), 1);
    range.adaptTable();
    expect(range.startNode.name).to.equal('p');
    expect(range.endNode.name).to.equal('p');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(false);
  });

  it('adaptBox method: should move out to the end strip of the table', () => {
    container.prepend('<table><tr><td>foo</td></tr></table>');
    container.append('<p>bar</p>');
    const range = new Range();
    range.setStart(container.find('td'), 1);
    range.setEnd(container.find('p'), 1);
    range.adaptTable();
    expect(range.startNode.name).to.equal('p');
    expect(range.endNode.name).to.equal('p');
    expect(range.startOffset).to.equal(0);
    expect(range.endOffset).to.equal(1);
    expect(range.isCollapsed).to.equal(false);
  });

  it('adaptBlock method: should move into next paragraph', () => {
    container.prepend('<p>foo</p>');
    container.append('<p>bar</p>');
    const range = new Range();
    range.setStartAfter(container.find('p').eq(0));
    range.collapseToStart();
    range.adaptBlock();
    expect(range.startNode.name).to.equal('p');
    expect(range.startNode.text()).to.equal('bar');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
  });

  it('adaptBlock method: should move into next box', () => {
    setTestBox(container);
    container.prepend('<p>foo</p>');
    container.append('<p>bar</p>');
    const range = new Range();
    range.setStartAfter(container.find('p').eq(0));
    range.collapseToStart();
    range.adaptBlock();
    expect(range.isBoxStart).to.equal(true);
  });

  it('adaptBlock method: should shrink', () => {
    container.html('<h1>foo</h1><ul><li>bar</li></ul><p>one</p>');
    const range = new Range();
    range.setStartBefore(container.find('ul'));
    range.setEndAfter(container.find('ul'));
    range.adaptBlock();
    expect(range.startNode.name).to.equal('li');
    expect(range.startOffset).to.equal(0);
    expect(range.endNode.name).to.equal('li');
    expect(range.endOffset).to.equal(1);
  });

  it('adaptBlock method: should relocate the end point of the range', () => {
    container.html('<h1>foo</h1><ul><li>bar</li></ul><p>one</p>');
    const range = new Range();
    range.setStartBefore(container.find('h1'));
    range.setEnd(container.find('li'), 0);
    range.adaptBlock();
    expect(range.startNode.name).to.equal('h1');
    expect(range.startOffset).to.equal(0);
    expect(range.endNode.name).to.equal('h1');
    expect(range.endOffset).to.equal(1);
  });

  it('method: adapt', () => {
    setTestBox(container);
    container.prepend('<p>foo</p>');
    container.append('<p>bar</p>');
    const range = new Range();
    range.setStartAfter(container.find('br').eq(0));
    range.collapseToStart();
    range.adapt();
    expect(range.startNode.name).to.equal('span');
    expect(range.startOffset).to.equal(0);
    expect(range.isCollapsed).to.equal(true);
  });

  it('getPrevNode method: startNode is a text, startOffset = 0', () => {
    container.html('<p>foo<strong>bold</strong>bar</p>');
    const range = new Range();
    range.setStart(container.find('strong').next(), 0);
    const prevNode = range.getPrevNode();
    expect(prevNode.name).to.equal('strong');
  });

  it('getPrevNode method: startNode is a text, startOffset > 0', () => {
    container.html('<p>foo<strong>bold</strong>bar</p>');
    const range = new Range();
    range.setStart(container.find('strong').next(), 1);
    const prevNode = range.getPrevNode();
    expect(prevNode.text()).to.equal('bar');
  });

  it('getPrevNode method: startNode is an element', () => {
    container.html('<p>foo<strong>bold</strong>bar</p>');
    const range = new Range();
    range.setStart(container.find('p'), 2);
    const prevNode = range.getPrevNode();
    expect(prevNode.name).to.equal('strong');
  });

  it('getNextNode method: endNode is a text, endOffset = 0', () => {
    container.html('<p>foo<strong>bold</strong>bar</p>');
    const range = new Range();
    range.setEnd(container.find('strong').prev(), 3);
    const nextNode = range.getNextNode();
    expect(nextNode.name).to.equal('strong');
  });

  it('getNextNode method: endNode is a text, endOffset > 0', () => {
    container.html('<p>foo<strong>bold</strong>bar</p>');
    const range = new Range();
    range.setEnd(container.find('strong').prev(), 1);
    const nextNode = range.getNextNode();
    expect(nextNode.text()).to.equal('foo');
  });

  it('getNextNode method: endNode is an element', () => {
    container.html('<p>foo<strong>bold</strong>bar</p>');
    const range = new Range();
    range.setEnd(container.find('p'), 1);
    const nextNode = range.getNextNode();
    expect(nextNode.name).to.equal('strong');
  });

  it('getBoxes method: collapsed range', () => {
    setTestBox(container);
    container.prepend('<p>foo</p>');
    container.append('<p>bar</p>');
    const range = new Range();
    range.setStartAfter(container.find('br').eq(1));
    range.collapseToStart();
    const boxList = range.getBoxes();
    expect(boxList.length).to.equal(1);
    expect(boxList[0].name).to.equal('lake-box');
  });

  it('getBoxes method: expanded range', () => {
    setTestBox(container);
    container.prepend('<p>foo</p>');
    container.append('<p>bar</p>');
    const range = new Range();
    range.setStartAfter(container.find('br').eq(0));
    range.setEndAfter(container.find('br').eq(1));
    const boxList = range.getBoxes();
    expect(boxList.length).to.equal(1);
    expect(boxList[0].name).to.equal('lake-box');
  });

  it('getBoxes method: select all', () => {
    setTestBox(container);
    container.append('<p>bar</p>');
    const box = new Box('inlineBox');
    container.find('p').prepend(box.node);
    box.render();
    container.prepend('<p>foo</p>');
    const range = new Range();
    range.selectNodeContents(container);
    const boxList = range.getBoxes();
    expect(boxList.length).to.equal(2);
    expect(boxList[0].attr('name')).to.equal('blockBox');
    expect(boxList[1].attr('name')).to.equal('inlineBox');
  });

  it('getBlocks method: no text is selected', () => {
    const content = `
    <p>outer start</p>
    <p>foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(1);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
  });

  it('getBlocks method: after selecting the contents of a block', () => {
    const content = `
    <p>outer start</p>
    <p><anchor />foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(1);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
  });

  it('getBlocks method: after selecting multiple blocks', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <h1>heading</h1>
    <p><i>itelic</i>ba<focus />r</p>
    <p>outer end</p>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(3);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
    expect(blocks[1].html()).to.equal('heading');
    expect(blocks[2].html()).to.equal('<i>itelic</i>bar');
  });

  it('getBlocks method: returns no block', () => {
    const content = `
    foo<strong>bar<focus /></strong>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(0);
  });

  it('getBlocks method: returns no block among other blocks', () => {
    const content = `
    <p>outer start</p>
    foo<strong>bar<focus /></strong>end
    <p>outer end</p>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(0);
  });

  it('getBlocks method: returns no block in the table', () => {
    const content = `
    <table>
      <tr>
        <td>foo<focus /></td>
      </tr>
    </table>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(0);
  });

  it('getBlocks method: returns a sub-block in the nested blocks when no text is selected', () => {
    const content = `
    <p>outer start</p>
    <blockquote><p>foo<strong>bold</strong><focus /></p></blockquote>
    <p>outer end</p>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(1);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
  });

  it('getBlocks method: returns top blocks in the nested blocks after select multiple blocks', () => {
    const content = `
    <p>outer start</p>
    <blockquote><p><anchor />foo1<strong>bold1</strong></p></blockquote>
    <blockquote><p>foo2<strong>bold2</strong><focus /></p></blockquote>
    <p>outer end</p>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(2);
    expect(blocks[0].html()).to.equal('<p>foo1<strong>bold1</strong></p>');
    expect(blocks[1].html()).to.equal('<p>foo2<strong>bold2</strong></p>');
  });

  it('getBlocks method: returns sub-block in the nested blocks after select multiple blocks', () => {
    const content = `
    <p>outer start</p>
    <blockquote>
      <p><anchor />foo1<strong>bold1</strong></p>
      <p>foo2<strong>bold2</strong><focus /></p>
    </blockquote>
    <p>outer end</p>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(2);
    expect(blocks[0].html()).to.equal('foo1<strong>bold1</strong>');
    expect(blocks[1].html()).to.equal('foo2<strong>bold2</strong>');
  });

  it('getBlocks method: the selection ends at the start of a block', () => {
    const content = `
    <p>outer start</p>
    <h1><anchor />foo<strong>bold</strong></h1>
    <p><focus />outer end</p>
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(1);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
  });

  it('getBlocks method: selects all', () => {
    const content = `
    <anchor /><p>a</p>
    <p>b</p>
    <p>c</p><focus />
    `;
    const result = createContainer(content);
    const blocks = result.range.getBlocks();
    result.container.remove();
    expect(blocks.length).to.equal(3);
    expect(blocks[0].html()).to.equal('a');
    expect(blocks[1].html()).to.equal('b');
    expect(blocks[2].html()).to.equal('c');
  });

  it('getMarks method: should get mark and text nodes', () => {
    const content = `
    <p><anchor />foo<strong>bold</strong><focus /></p>
    `;
    const result = createContainer(content);
    const marks = result.range.getMarks(true);
    result.container.remove();
    expect(marks.length).to.equal(3);
    expect(marks[0].text()).to.equal('foo');
    expect(marks[1].name).to.equal('strong');
    expect(marks[2].text()).to.equal('bold');
  });

  it('getMarks method: should only return mark nodes', () => {
    const content = `
    <p><anchor />foo<strong>bold</strong><focus /></p>
    `;
    const result = createContainer(content);
    const marks = result.range.getMarks(false);
    result.container.remove();
    expect(marks.length).to.equal(1);
    expect(marks[0].name).to.equal('strong');
  });

  it('getMarks method: the range is in the other mark', () => {
    const content = `
    <p><i><anchor />foo<strong>bold</strong><focus /></i></p>
    `;
    const result = createContainer(content);
    const marks = result.range.getMarks(true);
    result.container.remove();
    expect(marks.length).to.equal(3);
    expect(marks[0].text()).to.equal('foo');
    expect(marks[1].name).to.equal('strong');
    expect(marks[2].text()).to.equal('bold');
  });

  it('getMarks method: the range is part of a mark', () => {
    const content = `
    <p><i><anchor />foo</i><strong>bold</strong><focus /></p>
    `;
    const result = createContainer(content);
    const marks = result.range.getMarks(true);
    result.container.remove();
    expect(marks.length).to.equal(4);
    expect(marks[0].name).to.equal('i');
    expect(marks[1].text()).to.equal('foo');
    expect(marks[2].name).to.equal('strong');
    expect(marks[3].text()).to.equal('bold');
  });

  it('getStartText method: the point is between the characters of the text', () => {
    container.html('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 3);
    expect(range.getStartText()).to.equal('one');
  });

  it('getStartText method: the point is at the beginning of the text', () => {
    container.html('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 0);
    expect(range.getStartText()).to.equal('');
  });

  it('getStartText method: the point is at the end of the text', () => {
    container.html('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 6);
    expect(range.getStartText()).to.equal('onetwo');
  });

  it('getStartText method: should return the text of the closest block', () => {
    container.html('<div contenteditable="true"><p>previous block</p><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 0);
    expect(range.getStartText()).to.equal('');
  });

  it('getEndText method: the point is between the characters of the text', () => {
    container.html('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setEnd(container.find('strong').first(), 3);
    expect(range.getEndText()).to.equal('two');
  });

  it('getEndText method: the point is at the beginning of the text', () => {
    container.html('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setEnd(container.find('strong').first(), 0);
    expect(range.getEndText()).to.equal('onetwo');
  });

  it('getEndText method: the point is at the end of the text', () => {
    container.html('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setEnd(container.find('strong').first(), 6);
    expect(range.getEndText()).to.equal('');
  });

  it('getEndText method: should return the text of the closest block', () => {
    container.html('<div contenteditable="true"><p><strong>onetwo</strong></p><p>next block</p></div>');
    const range = new Range();
    range.setEnd(container.find('strong').first(), 6);
    expect(range.getEndText()).to.equal('');
  });

  it('method: clone', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    range.selectNode(container.find('strong'));
    const newRange = range.clone();
    expect(range.startNode.name).to.equal(newRange.startNode.name);
    expect(range.startOffset).to.equal(newRange.startOffset);
    expect(range.endNode.name).to.equal(newRange.endNode.name);
    expect(range.endOffset).to.equal(newRange.endOffset);
    expect(range.commonAncestor.name).to.equal(newRange.commonAncestor.name);
    expect(range.isCollapsed).to.equal(newRange.isCollapsed);
  });

  it('method: cloneContents', () => {
    container.html('<strong>foo</strong>bar');
    const range = new Range();
    range.selectNode(container.find('strong'));
    const fragment = range.cloneContents();
    expect(new Nodes(fragment.firstChild).name).to.equal('strong');
  });

});
