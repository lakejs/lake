import { getDeepElement } from '../utils/get-deep-element';
import { query } from '../utils/query';
import { removeZWS } from '../utils/remove-zws';
import { removeEmptyMarks } from '../utils/remove-empty-marks';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';
import { splitMarks } from './split-marks';

/**
 * Returns a nested mark copied from each last child of the descendants of the specified node.
 */
function getNestedMark(node: Nodes, tagName?: string): Nodes | null {
  if (!node.isMark || !tagName) {
    return null;
  }
  let mark: Nodes | null = null;
  let deepestMark: Nodes | null = null;
  let child = node;
  while (child.length > 0) {
    if (!child.isMark) {
      break;
    }
    if (child.name !== tagName) {
      if (deepestMark) {
        const newMark = child.clone();
        deepestMark.append(newMark);
        deepestMark = newMark;
      } else {
        mark = child.clone();
        deepestMark = mark;
      }
    }
    child = child.last();
  }
  return mark;
}

/**
 * Removes the specified marks in the range.
 */
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
    const newMark = getNestedMark(parts.start, tagName);
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
    const deepestMark = getDeepElement(newMark);
    deepestMark.append(zeroWidthSpace);
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
