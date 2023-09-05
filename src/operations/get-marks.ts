import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Returns target marks and text nodes relating to the specified range that can be modified by other operations.
export function getMarks(range: Range): Nodes[] {
  const stratRange = range.clone();
  stratRange.collapseToStart();
  const endRange = range.clone();
  endRange.collapseToEnd();
  const marks: Nodes[] = [];
  for (const node of range.commonAncestor.getWalker()) {
    const targetRange = document.createRange();
    targetRange.setStartAfter(node.get());
    targetRange.collapse(true);
    if (endRange.compareBeforeNode(node) >= 0) {
      break;
    }
    if (stratRange.compareAfterNode(node) > 0) {
      if ((node.isMark || node.isText) && !node.hasEmptyText) {
        marks.push(node);
      }
    }
  }
  return marks;
}
