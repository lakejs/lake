import { query } from '../utils';
import { Range } from '../models/range';
import { splitMarks } from './split-marks';
import { getMarks } from './get-marks';

export function removeMark(range: Range, value: string): void {
  const targetNode = query(value);
  const tagName = targetNode.name;
  // const styleValue = targetNode.attr('style');
  if (range.isCollapsed) {
    if (range.commonAncestor.closest(tagName).length === 0) {
      return;
    }
    splitMarks(range);
    return;
  }
  splitMarks(range);
  const nodeList = getMarks(range);
  for (const node of nodeList) {
    if (node.isMark && node.name === tagName) {
      node.remove(true);
    }
  }
}
