import { FigureItem } from '../types/figure';
import { Range } from '../models/range';
import { insertContents } from './insert-contents';
import { splitBlock } from './split-block';

// Inserts a Figure item into the specified range.
export function insertFigure(range: Range, figure: FigureItem): void {
  const content = `
    <figure type="${figure.type}" name="${figure.name}">
      <span class="figure-left"><br /></span>
      <div class="figure-body" contenteditable="false">${figure.render(figure.value)}</div>
      <span class="figure-right"><br /></span>
    </figure>
  `;
  if (figure.type === 'inline') {
    insertContents(range, content);
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
  insertContents(range, content);
  if (parts.left && parts.left.isEmpty) {
    parts.left.remove();
  }
}
