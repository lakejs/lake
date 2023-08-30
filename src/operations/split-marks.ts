import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Splits elements upwards according to the position until a limiting element is encountered.
// Case 1:
// <p><strong><em>foo<focus />bar</em></strong></p>
// to
// Step 1: <p><strong><em>foo</em><focus /><em>bar</em></strong></p>
// Step 2: <p><strong><em>foo</em></strong><focus /><strong><em>bar</em></strong></p>
//
// Case 2:
// <p><strong>beginning<em>one<focus />two</em>end</strong></p>
// to
// Step 1: <p><strong>beginning<em>one</em><focus /><em>two</em>end</strong></p>
// Step 2: <p><strong>beginning<em>one</em></strong><focus /><strong><em>two</em>end</strong></p>
function splitElements(node: Nodes, offset: number, limit: Nodes): Nodes | null {
  const range = new Range();
  let parent;
  if (node.isText) {
    parent = node.parent();
    node.splitText(offset);
    range.setStartAfter(node);
  } else {
    range.setStart(node, offset);
    parent = node;
  }
  range.collapseToStart();
  if (parent.get(0) === limit.get(0)) {
    return null;
  }
  const newParent = parent.clone();
  let child = parent.first();
  while (child.length > 0) {
    if (range.compareBeforeNode(child) >= 0) {
      break;
    }
    const next = child.next();
    newParent.append(child);
    child = next;
  }
  parent.before(newParent);
  if (parent.parent().length > 0 && parent.parent().get(0) !== limit.get(0)) {
    return splitElements(parent.parent(), parent.index(), limit);
  }
  return newParent;
}

// Splits text nodes or mark nodes.
// <p><strong>one<anchor />two<focus />three</strong></p>
// to
// <p><strong>one</strong><strong><anchor />two<focus /></strong><strong>three</strong></p>
export function splitMarks(range: Range): Nodes | null {
  if (range.isCollapsed) {
    const block = range.startNode.closestBlock();
    const newParent = splitElements(range.startNode, range.startOffset, block);
    if (newParent) {
      range.setStartAfter(newParent);
      range.collapseToStart();
    }
    return newParent;
  }
  const startBlock = range.startNode.closestBlock();
  const startNewParent = splitElements(range.startNode, range.startOffset, startBlock);
  if (startNewParent) {
    range.setStartAfter(startNewParent);
  }
  const endBlock = range.endNode.closestBlock();
  const endNewParent = splitElements(range.endNode, range.endOffset, endBlock);
  if (endNewParent) {
    range.setEndAfter(endNewParent);
  }
  return startNewParent;
}
