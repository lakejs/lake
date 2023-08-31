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

function getTargetNodes(range: Range): Nodes[] {
  const stratRange = range.clone();
  stratRange.collapseToStart();
  const endRange = range.clone();
  endRange.collapseToEnd();
  const nodeList: Nodes[] = [];
  for (const node of range.commonAncestor.getWalker()) {
    const targetRange = document.createRange();
    targetRange.setStartAfter(node.get());
    targetRange.collapse(true);
    if (endRange.compareBeforeNode(node) >= 0) {
      break;
    }
    if (stratRange.compareAfterNode(node) > 0) {
      if (node.isMark || node.isText) {
        nodeList.push(node);
      }
    }
  }
  return nodeList;
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
  const nodeList = getTargetNodes(range);
  for (const node of nodeList) {
    if (node.isMark) {
      node.before(targetNode);
      targetNode.append(node);
    }
    if (node.isText) {
      node.before(targetNode);
      targetNode.append(node);
    }
  }
}
