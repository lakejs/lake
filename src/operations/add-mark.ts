import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { splitMarks } from './split-marks';
import { getMarks } from './get-marks';

// Appends a node to the deepest element of the specified element.
function appendToDeepestElement(element: Nodes, node: Nodes) {
  let child = element;
  while (child.length > 0) {
    const firstChild = child.first();
    if (child.isElement && !child.isVoid && firstChild.length === 0) {
      child.append(node);
    }
    child = firstChild;
  }
}

// Removes zero-width space
function removeZeroWidthSpace(node: Nodes) {
  const prevNode = node.prev();
  if (prevNode.length > 0 && prevNode.isText && prevNode.text() === '\u200B') {
    prevNode.remove();
  }
  const nextNode = node.next();
  if (nextNode.length > 0 && nextNode.isText && nextNode.text() === '\u200B') {
    nextNode.remove();
  }
}

function copyNestedMarks(mark: Nodes): Nodes | null {
  if (!mark.isMark) {
    return null;
  }
  let newMark = mark.clone();
  let child = mark.last();
  while (child.length > 0) {
    if (child.isMark) {
      newMark.append(child.clone());
      newMark = child;
    }
    child = child.last();
  }
  return newMark;
}

export function addMark(range: Range, value: string): void {
  const valueNode = query(value);
  const tagName = valueNode.name;
  // const styleValue = valueNode.attr('style');
  if (range.commonAncestor.closest(tagName).length > 0) {
    return;
  }
  if (range.isCollapsed) {
    // https://en.wikipedia.org/wiki/Zero-width_space
    const zeroWidthSpace = new Nodes(document.createTextNode('\u200B'));
    const blockMap = splitMarks(range);
    if (blockMap.left) {
      const newMark = copyNestedMarks(blockMap.left);
      if (newMark) {
        appendToDeepestElement(newMark, zeroWidthSpace);
        valueNode.append(newMark);
      }
    }
    if (valueNode.text() === '') {
      valueNode.append(zeroWidthSpace);
    }
    range.insertNode(valueNode);
    removeZeroWidthSpace(valueNode);
    // Resets the position of the selection
    range.selectNodeContents(valueNode);
    range.reduce();
    range.collapseToEnd();
    return;
  }
  splitMarks(range);
  const nodeList = getMarks(range);
  for (const node of nodeList) {
    const newTargetNode = valueNode.clone();
    if (node.isMark) {
      node.before(newTargetNode);
      newTargetNode.append(node);
    }
    const parentNode = node.parent();
    if (node.isText && !parentNode.isMark) {
      node.before(newTargetNode);
      newTargetNode.append(node);
    }
  }
}
