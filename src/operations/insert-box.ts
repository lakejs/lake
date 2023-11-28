import { Range } from '../models/range';
import { Box } from '../models/box';
import { insertFragment } from './insert-fragment';
import { splitBlock } from './split-block';

// Inserts a box into the specified range.
export function insertBox(range: Range, boxName: string): void {
  const box = new Box(boxName);
  const fragment = document.createDocumentFragment();
  fragment.appendChild(box.node.get(0));
  if (box.type === 'inline') {
    insertFragment(range, fragment);
    box.render();
    range.selectBoxRight(box.node);
    return;
  }
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
