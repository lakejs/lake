import { query, splitNodes } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { deleteContents } from './delete-contents';

// Appends a node to the deepest element of the specified element.
function appendToDeepestElement(element: Nodes, node: Nodes): void {
  let child = element;
  while (child.length > 0) {
    let firstChild = child.first();
    if (firstChild.length > 0 && firstChild.isText && firstChild.hasEmptyText) {
      firstChild.remove();
      firstChild = child.first();
    }
    if (child.isElement && !child.isVoid && firstChild.length === 0) {
      child.append(node);
    }
    child = firstChild;
  }
}

// First, removes the contents of the specified range. Then, Split the block node.
// <p>one<anchor />two<focus />three</p>
// to
// <p>one</p>
// <p><focus />three</p>
export function splitBlock(range: Range): { left: Nodes | null, right: Nodes | null } {
  if (!range.isCollapsed) {
    deleteContents(range);
  }
  const node = range.startNode;
  const closestBlock = node.closestBlock();
  let limitBlock = closestBlock.parent();
  if (!limitBlock.isEditable) {
    limitBlock = node.closestContainer();
  }
  const blockMap = splitNodes(node, range.startOffset, limitBlock);
  let left = null;
  let right = null;
  if (blockMap) {
    left = blockMap.left;
    right = blockMap.right;
  }
  if (!blockMap && node.isBlock) {
    if (range.startOffset > 0) {
      left = node.children()[range.startOffset - 1];
    }
    right = node.children()[range.startOffset];
    if (right && !right.isBlock) {
      right = null;
    }
  }
  if (left) {
    if (left.hasEmptyText) {
      const br = query('<br />');
      appendToDeepestElement(left, br);
    }
  }
  if (right) {
    if (right.hasEmptyText) {
      const br = query('<br />');
      appendToDeepestElement(right, br);
    }
    range.selectNodeContents(right);
    range.reduce();
    range.collapseToStart();
  }
  return {
    left,
    right,
  };
}
