import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertNode } from './insert-node';
import { removeMark } from './remove-mark';
import { splitMarks } from './split-marks';

// Inserts a link element into the specified range.
export function insertLink(range: Range, value: string | Nodes): Nodes | null {
  if (range.commonAncestor.isOutside) {
    return null;
  }
  const valueNode = query(value);
  if (range.isCollapsed) {
    let linkNode = range.commonAncestor.closest('a');
    if (linkNode.length === 0) {
      linkNode = valueNode.clone(true);
      insertNode(range, linkNode);
      return linkNode;
    }
    linkNode.attr({
      href: valueNode.attr('href'),
    });
    return linkNode;
  }
  removeMark(range, '<a />');
  splitMarks(range);
  const nodeList = range.getMarks(true);
  if (nodeList.length === 0) {
    return null;
  }
  const node = nodeList[0];
  const linkNode = valueNode.clone(false);
  node.before(linkNode);
  linkNode.append(node);
  return linkNode;
}
