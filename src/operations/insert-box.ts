import { BoxValue } from '../types/box';
import { getBox } from '../utils/get-box';
import { Range } from '../models/range';
import { Box } from '../models/box';
import { splitMarks } from './split-marks';
import { insertFragment } from './insert-fragment';
import { insertBlock } from './insert-block';

// Inserts a box into the specified range.
export function insertBox(range: Range, boxName: string, boxValue?: BoxValue): Box | null {
  if (range.commonAncestor.isOutside) {
    return null;
  }
  const box = getBox(boxName);
  if (boxValue) {
    box.value = boxValue;
  }
  // inline box
  if (box.type === 'inline') {
    splitMarks(range);
    const fragment = document.createDocumentFragment();
    fragment.appendChild(box.node.get(0));
    insertFragment(range, fragment);
    box.render();
    range.selectBoxEnd(box.node);
    // move the box instance from temporary map to permanent map
    return getBox(box.node);
  }
  // block box
  insertBlock(range, box.node);
  box.render();
  range.selectBoxEnd(box.node);
  // move the box instance from temporary map to permanent map
  return getBox(box.node);
}
