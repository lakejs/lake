import { fixNumberedList } from '../utils/fix-numbered-list';
import { Range } from '../models/range';

// Fixes incorrect number for numbered list.
export function fixList(range: Range): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  const blocks = range.getBlocks();
  fixNumberedList(blocks);
}
