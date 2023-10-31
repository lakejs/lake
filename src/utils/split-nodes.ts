import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Splits nodes upwards according to the position until a limiting element is encountered.
// Case 1:
// <p><strong><i>foo<focus />bar</i></strong></p>
// to
// Step 1: <p><strong><i>foo</i><focus /><i>bar</i></strong></p>
// Step 2: <p><strong><i>foo</i></strong><focus /><strong><i>bar</i></strong></p>
//
// Case 2:
// <p><strong>beginning<i>one<focus />two</i>end</strong></p>
// to
// Step 1: <p><strong>beginning<i>one</i><focus /><i>two</i>end</strong></p>
// Step 2: <p><strong>beginning<i>one</i></strong><focus /><strong><i>two</i>end</strong></p>
export function splitNodes(node: Nodes, offset: number, limitNode: Nodes): { left: Nodes, right: Nodes } | null {
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
  if (parent.name === 'body' || parent.name === 'html') {
    return null;
  }
  if (parent.get(0) === limitNode.get(0)) {
    return null;
  }
  range.collapseToStart();
  const leftPart = parent.clone();
  let child = parent.first();
  while (child.length > 0) {
    if (range.compareBeforeNode(child) >= 0) {
      break;
    }
    const next = child.next();
    leftPart.append(child);
    child = next;
  }
  parent.before(leftPart);
  if (parent.parent().length > 0 && parent.parent().get(0) !== limitNode.get(0)) {
    return splitNodes(parent.parent(), parent.index(), limitNode);
  }
  return {
    left: leftPart,
    right: parent,
  };
}
