import { splitNodes } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Returns a boolean value indicating whether the node is an empty mark.
function isEmptyMark(node: Nodes): boolean {
  return node.isMark && node.first().length === 0;
}

// Removes empty marks that contain no content.
function removeEmptyMarks(node: Nodes): void {
  if (isEmptyMark(node)) {
    node.remove();
    return;
  }
  for (const child of node.getWalker()) {
    if (isEmptyMark(node)) {
      child.remove();
    }
  }
}

// Splits text nodes or mark nodes at a specified position.
function splitMarksAtPoint(node: Nodes, offset: number): { left: Nodes | null, right: Nodes | null } {
  let left = null;
  let right = null;
  const block = node.closestBlock();
  const parentNodes = splitNodes(node, offset, block);
  if (parentNodes) {
    removeEmptyMarks(parentNodes.left);
    removeEmptyMarks(parentNodes.right);
    if (!isEmptyMark(parentNodes.left)) {
      left = parentNodes.left;
    }
    if (!isEmptyMark(parentNodes.right)) {
      right = parentNodes.right;
    }
  }
  return {
    left,
    right,
  };
}

// Splits text nodes or mark nodes.
// <p><strong>one<anchor />two<focus />three</strong></p>
// to
// <p><strong>one</strong><strong><anchor />two<focus /></strong><strong>three</strong></p>
export function splitMarks(range: Range): { left: Nodes | null, right: Nodes | null } {
  if (range.isCollapsed) {
    const parentNodes = splitMarksAtPoint(range.startNode, range.startOffset);
    if (parentNodes.left) {
      range.setStartAfter(parentNodes.left);
      range.collapseToStart();
    } else if (parentNodes.right) {
      range.setStartBefore(parentNodes.right);
      range.collapseToStart();
    }
    return parentNodes;
  }
  const startParentNodes = splitMarksAtPoint(range.startNode, range.startOffset);
  if (startParentNodes.left) {
    range.setStartAfter(startParentNodes.left);
  } else if (startParentNodes.right) {
    range.setStartBefore(startParentNodes.right);
  }
  const endParentNodes = splitMarksAtPoint(range.endNode, range.endOffset);
  if (endParentNodes.left) {
    range.setEndAfter(endParentNodes.left);
  } else if (endParentNodes.right) {
    range.setEndBefore(endParentNodes.right);
  }
  return {
    left: startParentNodes.left,
    right: endParentNodes.right,
  };
}
