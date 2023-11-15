import { FigureItem } from '../types/figure';
import { Range } from '../models/range';
import { deleteContents } from './delete-contents';
import { insertContents } from './insert-contents';
import { splitBlock } from './split-block';

// Inserts a Figure item into the specified range.
export function insertFigure(range: Range, figure: FigureItem): void {
  if (!range.commonAncestor.isContentEditable) {
    return;
  }
  if (!range.isCollapsed) {
    deleteContents(range);
  }
  const content = `
    <figure type="${figure.type}" name="${figure.name}">
      ${figure.render(figure.value)}
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
