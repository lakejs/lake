import { TwoParts, ThreeParts } from '../types/object';
import { splitNodes } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

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

// Splits text nodes or mark nodes at a specified position.
function splitMarksAtPoint(node: Nodes, offset: number, removeEmptyMark: boolean): TwoParts {
  let start = null;
  let end = null;
  let limitBlock = node.closestBlock();
  if (limitBlock.length === 0) {
    limitBlock = node.closestContainer();
  }
  const parts = splitNodes(node, offset, limitBlock);
  if (parts) {
    if (removeEmptyMark) {
      removeEmptyMarks(parts.start);
      removeEmptyMarks(parts.end);
      if (!parts.start.isEmpty) {
        start = parts.start;
      }
      if (!parts.end.isEmpty) {
        end = parts.end;
      }
    } else {
      start = parts.start;
      end = parts.end;
    }
  }
  return {
    start,
    end,
  };
}

// Splits text nodes or mark nodes.
// <p><strong>one<anchor />two<focus />three</strong></p>
// to
// <p><strong>one</strong><strong><anchor />two<focus /></strong><strong>three</strong></p>
export function splitMarks(range: Range, removeEmptyMark: boolean = true): ThreeParts {
  if (range.commonAncestor.isOutside) {
    return {
      start: null,
      center: null,
      end: null,
    };
  }
  range.adaptBox();
  if (range.isCollapsed) {
    const parts = splitMarksAtPoint(range.startNode, range.startOffset, removeEmptyMark);
    if (parts.start) {
      range.setStartAfter(parts.start);
      range.collapseToStart();
    } else if (parts.end) {
      range.setStartBefore(parts.end);
      range.collapseToStart();
    }
    return {
      start: parts.start,
      center: null,
      end: parts.end,
    };
  }
  const startParts = splitMarksAtPoint(range.startNode, range.startOffset, removeEmptyMark);
  if (startParts.start) {
    range.setStartAfter(startParts.start);
  } else if (startParts.end) {
    range.setStartBefore(startParts.end);
  }
  const endParts = splitMarksAtPoint(range.endNode, range.endOffset, removeEmptyMark);
  if (endParts.start) {
    range.setEndAfter(endParts.start);
  } else if (endParts.end) {
    range.setEndBefore(endParts.end);
  }
  return {
    start: startParts.start,
    center: endParts.start,
    end: endParts.end,
  };
}
