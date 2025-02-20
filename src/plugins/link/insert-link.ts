import { query } from '@/utils/query';
import { Nodes } from '@/models/nodes';
import { Range } from '@/models/range';
import { insertContents } from '@/operations/insert-contents';
import { splitMarks } from '@/operations/split-marks';
import { insertBookmark } from '@/operations/insert-bookmark';
import { toBookmark } from '@/operations/to-bookmark';

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
      insertContents(range, linkNode);
      return linkNode;
    }
    const url = valueNode.attr('href');
    if (url !== '') {
      linkNode.attr({
        href: valueNode.attr('href'),
      });
    }
    return linkNode;
  }
  splitMarks(range);
  const bookmark = insertBookmark(range);
  for (const child of range.commonAncestor.getWalker()) {
    if (child.name === 'a' && range.intersectsNode(child)) {
      child.remove(true);
    }
  }
  const linkNode = valueNode.clone(false);
  bookmark.anchor.after(linkNode);
  let node = linkNode.next();
  while (node.length > 0) {
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
