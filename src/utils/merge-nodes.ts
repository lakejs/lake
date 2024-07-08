import type { Nodes } from '../models/nodes';
import { appendDeepest } from './append-deepest';
import { query } from './query';
import { removeBreak } from './remove-break';
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
export function mergeNodes(node: Nodes, otherNode: Nodes): { node: Nodes, offset: number } {
  const originalOtherNode = otherNode;
  if (['ul', 'ol'].indexOf(node.name) >= 0) {
    const list = node.find('li');
    node = list.eq(list.length - 1);
  }
  if (['ul', 'ol'].indexOf(otherNode.name) >= 0) {
    const list = otherNode.find('li');
    otherNode = list.eq(0);
  }
  if (node.isText || otherNode.isText || node.isVoid || otherNode.isVoid) {
    return getAfterPoint(node);
  }
  removeBreak(node);
  removeBreak(otherNode);
  if (node.isBlock && node.isEmpty && otherNode.isEmpty) {
    appendDeepest(node, query('<br />'));
  }
  const nextNode = node.last();
  const nextOtherNode = otherNode.first();
  let child = nextOtherNode;
  while (child.length > 0) {
    const next = child.next();
    node.append(child);
    child = next;
  }
  originalOtherNode.remove();
  if (
    nextNode.length > 0 &&
    nextOtherNode.length > 0 &&
    nextNode.isElement &&
    !nextNode.isBox &&
    nextNode.clone(false).get(0).isEqualNode(nextOtherNode.clone(false).get(0))
  ) {
    return mergeNodes(nextNode, nextOtherNode);
  }
  if (nextNode.length === 0) {
    return {
      node,
      offset: 0,
    };
  }
  return getAfterPoint(nextNode);
}
