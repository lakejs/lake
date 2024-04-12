import { appendDeepest, query, removeZWS } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';
import { splitMarks } from './split-marks';

// Removes empty marks that contain no content.
function removeEmptyMarks(node: Nodes): void {
  if (node.isMark && node.isEmpty) {
    node.remove();
    return;
  }
  for (const child of node.getWalker()) {
    if (child.isMark && child.isEmpty) {
      child.remove();
    }
  }
}

// Returns an element copied from each last child of the descendants of the specified node.
function copyNestedMarks(node: Nodes, tagName?: string): Nodes | null {
  if (!node.isMark || !tagName) {
    return null;
  }
  let newMark = node.clone();
  let child = node.last();
  while (child.length > 0) {
    if (child.isMark && child.name !== tagName) {
      const newChild = child.clone();
      newMark.append(newChild);
      newMark = newChild;
    }
    child = child.last();
  }
  if (newMark.name === tagName) {
    if (newMark.first().length > 0) {
      newMark = newMark.first();
    } else {
      return null;
    }
  }
  return newMark;
}

// Removes the specified marks from the range.
export function removeMark(range: Range, value?: string): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  let tagName;
  if (value) {
    const valueNode = query(value);
    tagName = valueNode.name;
  }
  if (range.isCollapsed) {
    if (range.isBox) {
      return;
    }
    if (tagName && range.commonAncestor.closest(tagName).length === 0) {
      return;
    }
    const parts = splitMarks(range, false);
    if (!parts.start) {
      return;
    }
    if (parts.end) {
      removeEmptyMarks(parts.end);
    }
    const zeroWidthSpace = new Nodes(document.createTextNode('\u200B'));
    const newMark = copyNestedMarks(parts.start, tagName);
    if (!newMark) {
      parts.start.after(zeroWidthSpace);
      removeEmptyMarks(parts.start);
      if (zeroWidthSpace.prev().isText) {
        range.setStartAfter(zeroWidthSpace.prev());
        range.collapseToStart();
        zeroWidthSpace.remove();
        return;
      }
      range.setStartAfter(zeroWidthSpace);
      range.collapseToStart();
      return;
    }
    appendDeepest(newMark, zeroWidthSpace);
    parts.start.after(newMark);
    removeEmptyMarks(parts.start);
    range.shrinkAfter(newMark);
    return;
  }
  splitMarks(range);
  const marks = range.getMarks();
  const bookmark = insertBookmark(range);
  for (const mark of marks) {
    if (!tagName || mark.name === tagName) {
      const parentNode = mark.parent();
      mark.remove(!mark.isEmpty);
      if (parentNode.length > 0) {
        parentNode.get(0).normalize();
      }
    }
  }
  removeZWS(range.commonAncestor);
  toBookmark(range, bookmark);
}
