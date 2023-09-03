import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { splitMarks } from './split-marks';
import { getMarks } from './get-marks';

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
    const blockMap = splitMarks(range);
    if (blockMap.left) {
      const newMark = copyNestedMarks(blockMap.left);
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
  const nodeList = getMarks(range);
  for (const node of nodeList) {
    const newTargetNode = targetNode.clone(true);
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
