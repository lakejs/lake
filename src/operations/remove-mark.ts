import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { splitMarks } from './split-marks';
import { getMarks } from './get-marks';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

// Removes the specified marks from the range.
export function removeMark(range: Range, value: string): void {
  const valueNode = query(value);
  const tagName = valueNode.name;
  // const styleValue = valueNode.attr('style');
  if (range.isCollapsed) {
    if (range.commonAncestor.closest(tagName).length === 0) {
      return;
    }
    const blockMap = splitMarks(range);
    if (blockMap.left && blockMap.left.isMark && blockMap.right && blockMap.right.isMark) {
      const zeroWidthSpace = new Nodes(document.createTextNode('\u200B'));
      blockMap.left.after(zeroWidthSpace);
      range.setStartAfter(zeroWidthSpace);
      range.collapseToStart();
    }
    return;
  }
  splitMarks(range);
  const nodeList = getMarks(range);
  const bookmark = insertBookmark(range);
  for (const node of nodeList) {
    if (node.isMark && node.name === tagName) {
      node.remove(true);
    }
  }
  toBookmark(range, bookmark);
}
