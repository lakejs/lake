import { Box } from '../types/box';
import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertFragment } from './insert-fragment';
import { splitBlock } from './split-block';

// Inserts a box into the specified range.
export function insertBox(range: Range, box: Box): Nodes {
  const html = `<lake-box type="${box.type}" name="${box.name}"></lake-box>`;
  const boxNode = query(html.trim());
  if (box.value) {
    boxNode.attr('value', btoa(JSON.stringify(box.value)));
  }
  const fragment = document.createDocumentFragment();
  fragment.appendChild(boxNode.get(0));
  if (box.type === 'inline') {
    insertFragment(range, fragment);
    return boxNode;
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
  if (parts.left && parts.left.isEmpty) {
    parts.left.remove();
  }
  return boxNode;
}
