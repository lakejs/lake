import { TwoParts } from '../types/object';
import { splitNodes, appendBreak } from '../utils';
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
      start: null,
      end: null,
    };
  }
  if (range.isCollapsed) {
    range.adjustBox();
  } else {
    deleteContents(range);
  }
  const node = range.startNode;
  const closestBlock = node.closestOperableBlock();
  if (closestBlock.length === 0) {
    return {
      start: null,
      end: null,
    };
  }
  let limitBlock = closestBlock.parent();
  if (limitBlock.isOutside) {
    limitBlock = node.closestContainer();
  }
  const parts = splitNodes(node, range.startOffset, limitBlock);
  let start = null;
  let end = null;
  if (parts) {
    start = parts.start;
    end = parts.end;
  }
  if (!parts && node.isBlock) {
    if (range.startOffset > 0) {
      start = node.children()[range.startOffset - 1];
    }
    end = node.children()[range.startOffset];
    if (end && !end.isBlock) {
      end = null;
    }
  }
  if (start && start.isEmpty) {
    appendBreak(start);
  }
  if (end) {
    if (end.isEmpty) {
      appendBreak(end);
    }
    range.shrinkBefore(end);
  }
  fixList(range);
  return {
    start,
    end,
  };
}
