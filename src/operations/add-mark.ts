import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { splitMarks } from './split-marks';

function copyNestedMarks(mark: Nodes): Nodes | null {
  if (!mark.isMark) {
    return null;
  }
  let newMark = mark.clone();
  let child = mark.first();
  while (child.length > 0) {
    if (child.isMark) {
      newMark.append(child.clone());
      newMark = child;
    }
    child = child.first();
  }
  return newMark;
}

export function addMark(range: Range, value: string): void {
  const targetNode = query(value);
  const tagName = targetNode.name;
  // const styleValue = targetNode.attr('style');
  if (range.commonAncestor.closest(tagName).length > 0) {
    return;
  }
  if (range.isCollapsed) {
    const newParent = splitMarks(range);
    if (newParent) {
      const newMark = copyNestedMarks(newParent);
      if (newMark) {
        targetNode.append(newMark);
      }
    }
    range.insertNode(targetNode);
    range.selectNodeContents(targetNode);
    range.collapseToStart();
    range.reduce();
    return;
  }
  splitMarks(range);
  const stratRange = range.clone();
  stratRange.collapseToStart();
  const endRange = range.clone();
  endRange.collapseToEnd();
  for (const child of range.commonAncestor.getWalker()) {
    if (endRange.compareBeforeNode(child) < 0) {
      break;
    }
    if (stratRange.compareAfterNode(child) > 0) {
      if (child.isMark) {
        child.before(targetNode);
        targetNode.append(child);
      }
      if (child.isText) {
        child.before(targetNode);
        targetNode.append(child);
      }
    }
  }
}
