import { Range } from '../models/range';
import { deleteContents } from './delete-contents';
import { insertContents } from './insert-contents';

// Inserts a Node into the specified range.
export function insertFigure(range: Range, figure: any): void {
  if (!range.commonAncestor.isContentEditable) {
    return;
  }
  if (!range.isCollapsed) {
    deleteContents(range);
  }
  const name = figure.name;
  insertContents(range, `<figure name="${name}" />`);
}
