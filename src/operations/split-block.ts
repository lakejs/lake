import { TwoParts } from '../types/object';
import { query, splitNodes, appendDeepest } from '../utils';
import { Range } from '../models/range';
import { fixList } from './fix-list';
import { deleteContents } from './delete-contents';

// Removes the contents of the specified range and then splits the block node at the point of the collapsed range.
// <p>one<anchor />two<focus />three</p>
// to
// <p>one</p>
// <p><focus />three</p>
export function splitBlock(range: Range): TwoParts {
  if (range.commonAncestor.isOutside) {
    return {
      left: null,
      right: null,
    };
  }
  if (range.isCollapsed) {
    range.adaptBox();
  } else {
    deleteContents(range);
  }
  const node = range.startNode;
  const closestBlock = node.closestOperableBlock();
  if (closestBlock.length === 0) {
    return {
      left: null,
      right: null,
    };
  }
  let limitBlock = closestBlock.parent();
  if (limitBlock.isOutside) {
    limitBlock = node.closestContainer();
  }
  const parts = splitNodes(node, range.startOffset, limitBlock);
  let left = null;
  let right = null;
  if (parts) {
    left = parts.left;
    right = parts.right;
  }
  if (!parts && node.isBlock) {
    if (range.startOffset > 0) {
      left = node.children()[range.startOffset - 1];
    }
    right = node.children()[range.startOffset];
    if (right && !right.isBlock) {
      right = null;
    }
  }
  if (left && left.isEmpty) {
    appendDeepest(left, query('<br />'));
  }
  if (right) {
    if (right.isEmpty) {
      appendDeepest(right, query('<br />'));
      range.shrinkAfter(right);
    } else {
      range.shrinkBefore(right);
    }
  }
  fixList(range);
  return {
    left,
    right,
  };
}
