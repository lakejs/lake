import { parseStyle, query, getBox, appendDeepest, removeBreak } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';
import { splitMarks } from './split-marks';
import { insertNode } from './insert-node';

// Removes zero-width space before or after the node.
function removePreviousOrNextZWS(node: Nodes): void {
  const prevNode = node.prev();
  if (prevNode.length > 0 && prevNode.isText && prevNode.isEmpty) {
    prevNode.remove();
  }
  const nextNode = node.next();
  if (nextNode.length > 0 && nextNode.isText && nextNode.isEmpty) {
    nextNode.remove();
  }
}

// Returns an element copied from each last child of the descendants of the specified node.
function copyNestedMarks(node: Nodes): Nodes | null {
  if (!node.isMark) {
    return null;
  }
  let newMark = node.clone();
  let child = node.last();
  while (child.length > 0) {
    if (child.isMark) {
      const newChild = child.clone();
      newMark.append(newChild);
      newMark = newChild;
    }
    child = child.last();
  }
  return newMark;
}

// Returns the topmost mark element or the closest element with the same tag name as the specified node.
function getUpperMark(node: Nodes, tagName: string): Nodes {
  const nodeText = node.text();
  let parent = node;
  while(parent.length > 0) {
    const nextParent = parent.parent();
    if (
      !nextParent.isMark ||
      nodeText !== nextParent.text() ||
      !parent.isText && parent.name === tagName && parent.attr('style') !== ''
    ) {
      break;
    }
    parent = nextParent;
  }
  return parent;
}

// Adds the specified mark to the texts of the range.
export function addMark(range: Range, value: string | Nodes): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  let valueNode = query(value);
  const tagName = valueNode.name;
  const styleValue = valueNode.attr('style');
  const cssProperties = parseStyle(styleValue);
  if (range.isCollapsed) {
    if (range.isBox) {
      const boxNode = range.startNode.closest('lake-box');
      const box = getBox(boxNode);
      if (box.type === 'block') {
        const newBlock = query('<p><br /></p>');
        if (range.isBoxStart) {
          boxNode.before(newBlock);
        } else {
          boxNode.after(newBlock);
        }
        range.shrinkAfter(newBlock);
      } else {
        range.adjustBox();
      }
    }
    const block = range.startNode.closestBlock();
    removeBreak(block);
    // https://en.wikipedia.org/wiki/Zero-width_space
    const zeroWidthSpace = new Nodes(document.createTextNode('\u200B'));
    const parts = splitMarks(range);
    if (parts.start) {
      const newMark = copyNestedMarks(parts.start);
      if (newMark) {
        if (newMark.name === tagName) {
          newMark.css(cssProperties);
          valueNode = newMark;
        } else {
          appendDeepest(newMark, zeroWidthSpace);
          valueNode.append(newMark);
        }
      }
    }
    if (valueNode.text() === '') {
      valueNode.append(zeroWidthSpace);
    }
    insertNode(range, valueNode);
    removePreviousOrNextZWS(valueNode);
    range.shrinkAfter(valueNode);
    return;
  }
  splitMarks(range);
  const nodeList = range.getMarks(true);
  const bookmark = insertBookmark(range);
  for (const node of nodeList) {
    if (!node.isEmpty) {
      if (node.isText) {
        const upperMark = getUpperMark(node, tagName);
        if (upperMark.isMark && upperMark.name === tagName) {
          upperMark.css(cssProperties);
        } else {
          const newValueNode = valueNode.clone();
          upperMark.before(newValueNode);
          newValueNode.append(upperMark);
        }
      }
    }
  }
  toBookmark(range, bookmark);
}
