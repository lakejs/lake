import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { splitMarks } from './split-marks';

function cloneNestedMarksAfterBlock(mark: Nodes) {
  let newMark = mark.clone();
  let child = mark.last();
  while (child.length > 0) {
    if (child.isMark) {
      newMark.append(child);
      newMark = child;
    }
    child = child.last();
  }
  return newMark;
}

export function addMark(range: Range, value: string): void {
  const targetNode = query(value);
  // const tagName = targetNode.name;
  // const styleValue = targetNode.attr('style');
  splitMarks(range);
  cloneNestedMarksAfterBlock(range.startNode);
  range.insertNode(targetNode);
  range.selectNodeContents(targetNode);
  range.reduce();
}
