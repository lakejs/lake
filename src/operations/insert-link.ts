import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertNode } from './insert-node';
import { removeMark } from './remove-mark';
import { splitMarks } from './split-marks';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

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
  const bookmark = insertBookmark(range);
  const linkNode = valueNode.clone(false);
  bookmark.anchor.after(linkNode);
  let node = linkNode.next();
  while(node.length > 0) {
    const nextNode = node.next();
    if (!node.isMark && !node.isText) {
      break;
    }
    linkNode.append(node);
    node = nextNode;
  }
  if (linkNode.first().length === 0) {
    linkNode.remove();
  }
  toBookmark(range, bookmark);
  return linkNode;
}
