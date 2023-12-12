import { Range } from '../models/range';
import { Box } from '../models/box';
import { insertFragment } from './insert-fragment';
import { splitBlock } from './split-block';

// Inserts a box into the specified range.
export function insertBox(range: Range, boxName: string): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  const box = new Box(boxName);
  const fragment = document.createDocumentFragment();
  fragment.appendChild(box.node.get(0));
  // inline box
  if (box.type === 'inline') {
    insertFragment(range, fragment);
    box.render();
    range.selectBoxRight(box.node);
    return;
  }
  // block box
  const parts = splitBlock(range);
  if (parts.left) {
    range.setEndAfter(parts.left);
    range.collapseToEnd();
  }
  if (parts.right && parts.right.isEmpty) {
    parts.right.remove();
  }
  insertFragment(range, fragment);
  box.render();
  range.selectBoxRight(box.node);
  if (parts.left && parts.left.isEmpty) {
    parts.left.remove();
  }
}
