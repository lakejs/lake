import type { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { appendDeepest } from './append-deepest';
import { query } from './query';
import { removeBr } from './remove-br';

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
  const originalLatter = latter;
  if (['ul', 'ol'].indexOf(former.name) >= 0) {
    const list = former.find('li');
    former = list.eq(list.length - 1);
  }
  if (['ul', 'ol'].indexOf(latter.name) >= 0) {
    const list = latter.find('li');
    latter = list.eq(0);
  }
  if (former.isText || latter.isText || former.isVoid || latter.isVoid) {
    return getAfterPoint(former);
  }
  removeBr(former);
  removeBr(latter);
  if (former.isBlock && former.isEmpty && latter.isEmpty) {
    appendDeepest(former, query('<br />'));
  }
  const wouldBeFormer = former.last();
  const wouldBeLatter = latter.first();
  let child = wouldBeLatter;
  while (child.length > 0) {
    const nextNode = child.next();
    former.append(child);
    child = nextNode;
  }
  originalLatter.remove();
  if (
    wouldBeFormer.length > 0 &&
    wouldBeLatter.length > 0 &&
    wouldBeFormer.isElement &&
    wouldBeFormer.clone(false).get(0).isEqualNode(wouldBeLatter.clone(false).get(0))
  ) {
    return mergeNodes(wouldBeFormer, wouldBeLatter);
  }
  if (wouldBeFormer.length === 0) {
    return {
      node: former,
      offset: 0,
    };
  }
  return getAfterPoint(wouldBeFormer);
}
