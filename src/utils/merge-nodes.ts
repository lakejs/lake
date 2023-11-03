import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Returns a point after the specified node.
function getAfterPoint(node: Nodes): { node: Nodes, offset: number } {
  if (node.isText) {
    return {
      node,
      offset: node.text().length,
    };
  }
  const range = new Range();
  range.setEndAfter(node);
  return {
    node: range.endNode,
    offset: range.endOffset,
  };
}

// Merges two nodes into one node.
// Case 1:
// <p><strong><i>foo</i></strong></p>
// <p>|bar</p>
// to
// <p><strong><i>foo</i></strong>|bar</p>
//
// Case 2:
// <p><strong><i>foo</i></strong></p>
// <p>|<strong><i>bar</i></strong></p>
// to
// <p><strong><i>foo|bar</i></strong></p>
export function mergeNodes(former: Nodes, latter: Nodes): { node: Nodes, offset: number } {
  if (former.isText || latter.isText || former.isVoid || latter.isVoid) {
    return getAfterPoint(former);
  }
  const wouldBeFormer = former.last();
  const wouldBeLatter = latter.first();
  let child = wouldBeLatter;
  while (child.length > 0) {
    const nextNode = child.next();
    former.append(child);
    child = nextNode;
  }
  latter.remove();

  if (
    wouldBeFormer.length > 0 &&
    wouldBeFormer.isElement &&
    wouldBeFormer.clone(false).get(0).isEqualNode(wouldBeLatter.clone(false).get(0))
  ) {
    return mergeNodes(wouldBeFormer, wouldBeLatter);
  }
  return getAfterPoint(wouldBeFormer);
}
