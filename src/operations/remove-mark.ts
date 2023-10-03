import { appendDeepest, query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { splitMarks } from './split-marks';
import { getMarks } from './get-marks';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

// Returns an element copied from each first child of the descendants of the specified node.
function copyNestedMarks(node: Nodes, tagName: string): Nodes | null {
  if (!node.isMark) {
    return null;
  }
  let newMark = node.clone();
  let child = node.last();
  while (child.length > 0) {
    if (child.isMark && tagName && child.name !== tagName) {
      newMark.append(child.clone());
      newMark = child;
    }
    child = child.last();
  }
  if (newMark.name === tagName) {
    if (newMark.first().length > 0) {
      const firstChild = newMark.first();
      newMark.remove(true);
      newMark = firstChild;
    } else {
      return null;
    }
  }
  return newMark;
}

// Removes the specified marks from the range.
export function removeMark(range: Range, value: string): void {
  if (!range.commonAncestor.isContentEditable) {
    return;
  }
  const valueNode = query(value);
  const tagName = valueNode.name;
  if (range.isCollapsed) {
    if (range.commonAncestor.closest(tagName).length === 0) {
      return;
    }
    const parts = splitMarks(range, false);
    if (parts.left) {
      const zeroWidthSpace = new Nodes(document.createTextNode('\u200B'));
      const newMark = copyNestedMarks(parts.left, tagName);
      if (newMark) {
        appendDeepest(newMark, zeroWidthSpace);
        parts.left.after(newMark);
        // Resets the position of the selection
        range.selectNodeContents(newMark);
        range.reduce();
        range.collapseToEnd();
        return;
      }
      parts.left.after(zeroWidthSpace);
      range.setStartAfter(zeroWidthSpace);
      range.collapseToStart();
    }
    return;
  }
  splitMarks(range);
  const nodeList = getMarks(range);
  const bookmark = insertBookmark(range);
  for (const node of nodeList) {
    if (node.isMark && node.name === tagName) {
      node.remove(true);
    }
  }
  toBookmark(range, bookmark);
}
