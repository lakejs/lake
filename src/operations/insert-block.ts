import { query } from '../utils/query';
import { removeEmptyMarks } from '../utils/remove-empty-marks';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertContents } from './insert-contents';
import { splitBlock } from './split-block';

/**
 * Inserts a block into the specified range.
 */
export function insertBlock(range: Range, value: string | Nodes): Nodes | null {
  if (range.commonAncestor.isOutside) {
    return null;
  }
  const block = query(value);
  const parts = splitBlock(range);
  if (parts.start) {
    removeEmptyMarks(parts.start);
    range.setEndAfter(parts.start);
    range.collapseToEnd();
  }
  if (parts.end) {
    removeEmptyMarks(parts.end);
    if (parts.end.isEmpty) {
      parts.end.remove();
    }
  }
  insertContents(range, block);
  if (!block.isBox) {
    range.shrinkAfter(block);
  }
  if (parts.start && parts.start.isEmpty) {
    parts.start.remove();
  }
  return block;
}
