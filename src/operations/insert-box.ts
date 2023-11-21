import { Box } from '../types/box';
import { query } from '../utils';
import { Range } from '../models/range';
import { insertFragment } from './insert-fragment';
import { splitBlock } from './split-block';

function createBoxFragment(box: Box): DocumentFragment {
  const html = `
    <lake-box type="${box.type}" name="${box.name}">
      <span class="box-strip"><br /></span>
      <div class="box-body" contenteditable="false">${box.render(box.value)}</div>
      <span class="box-strip"><br /></span>
    </lake-box>
  `;
  const boxNode = query(html.trim());
  if (box.value) {
    boxNode.attr('value', btoa(JSON.stringify(box.value)));
  }
  const fragment = document.createDocumentFragment();
  fragment.appendChild(boxNode.get(0));
  return fragment;
}

// Inserts a box into the specified range.
export function insertBox(range: Range, box: Box): void {
  const fragment = createBoxFragment(box);
  if (box.type === 'inline') {
    insertFragment(range, fragment);
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
  if (parts.left && parts.left.isEmpty) {
    parts.left.remove();
  }
}
