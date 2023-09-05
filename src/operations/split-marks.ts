import { splitNodes } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Removes empty marks that contain no content.
function removeEmptyMarks(node: Nodes): void {
  if (node.isMark && node.hasEmptyText) {
    node.remove();
    return;
  }
  for (const child of node.getWalker()) {
    if (child.isMark && child.hasEmptyText) {
      child.remove();
    }
  }
}

// Splits text nodes or mark nodes at a specified position.
function splitMarksAtPoint(node: Nodes, offset: number): { left: Nodes | null, right: Nodes | null } {
  let left = null;
  let right = null;
  const block = node.closestBlock();
  const blockMap = splitNodes(node, offset, block);
  if (blockMap) {
    removeEmptyMarks(blockMap.left);
    removeEmptyMarks(blockMap.right);
    if (!blockMap.left.hasEmptyText) {
      left = blockMap.left;
    }
    if (!blockMap.right.hasEmptyText) {
      right = blockMap.right;
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
export function splitMarks(range: Range):{ left: Nodes | null, center: Nodes | null, right: Nodes | null } {
  if (range.isCollapsed) {
    const blockMap = splitMarksAtPoint(range.startNode, range.startOffset);
    if (blockMap.left) {
      range.setStartAfter(blockMap.left);
      range.collapseToStart();
    } else if (blockMap.right) {
      range.setStartBefore(blockMap.right);
      range.collapseToStart();
    }
    return {
      left: blockMap.left,
      center: null,
      right: blockMap.right,
    };
  }
  const startBlockMap = splitMarksAtPoint(range.startNode, range.startOffset);
  if (startBlockMap.left) {
    range.setStartAfter(startBlockMap.left);
  } else if (startBlockMap.right) {
    range.setStartBefore(startBlockMap.right);
  }
  const endBlockMap = splitMarksAtPoint(range.endNode, range.endOffset);
  if (endBlockMap.left) {
    range.setEndAfter(endBlockMap.left);
  } else if (endBlockMap.right) {
    range.setEndBefore(endBlockMap.right);
  }
  return {
    left: startBlockMap.left,
    center: endBlockMap.left,
    right: endBlockMap.right,
  };
}
