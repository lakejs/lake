import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Splits nodes upwards according to the position until a limiting element is encountered.
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
export function splitNodes(node: Nodes, offset: number, limit: Nodes): { left: Nodes, right: Nodes } | null {
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
  const leftParent = parent.clone();
  let child = parent.first();
  while (child.length > 0) {
    if (range.compareBeforeNode(child) >= 0) {
      break;
    }
    const next = child.next();
    leftParent.append(child);
    child = next;
  }
  parent.before(leftParent);
  if (parent.parent().length > 0 && parent.parent().get(0) !== limit.get(0)) {
    return splitNodes(parent.parent(), parent.index(), limit);
  }
  return {
    left: leftParent,
    right: parent,
  };
}
