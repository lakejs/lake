import { BoxValue } from '../types/box';
import { getBox } from '../utils/get-box';
import { Range } from '../models/range';
import { Box } from '../models/box';
import { insertFragment } from './insert-fragment';
import { splitBlock } from './split-block';

// Inserts a box into the specified range.
export function insertBox(range: Range, boxName: string, boxValue?: BoxValue): Box | null {
  if (range.commonAncestor.isOutside) {
    return null;
  }
  const box = getBox(boxName);
  if (boxValue) {
    box.value = boxValue;
  }
  const fragment = document.createDocumentFragment();
  fragment.appendChild(box.node.get(0));
  // inline box
  if (box.type === 'inline') {
    insertFragment(range, fragment);
    box.render();
    range.selectBoxEnd(box.node);
    return box;
  }
  // block box
  const parts = splitBlock(range);
  if (parts.start) {
    range.setEndAfter(parts.start);
    range.collapseToEnd();
  }
  if (parts.end && parts.end.isEmpty) {
    parts.end.remove();
  }
  insertFragment(range, fragment);
  box.render();
  range.selectBoxEnd(box.node);
  if (parts.start && parts.start.isEmpty) {
    parts.start.remove();
  }
  return box;
}
