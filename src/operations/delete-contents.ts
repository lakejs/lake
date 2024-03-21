import { query } from '../utils/query';
import { appendDeepest } from '../utils/append-deepest';
import { mergeNodes } from '../utils/merge-nodes';
import { Range } from '../models/range';
import { fixList } from './fix-list';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

// Removes the contents of the specified range.
export function deleteContents(range: Range): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  if (range.isCollapsed) {
    return;
  }
  range.adaptBox();
  // Relocates the beginning or end position of the range for table.
  const startTable = range.startNode.closest('table');
  const endTable = range.endNode.closest('table');
  if (startTable.length === 0 && endTable.length > 0 && endTable.isInside) {
    range.setEndBefore(endTable);
    range.shrink();
  } else if (endTable.length === 0 && startTable.length > 0 && startTable.isInside) {
    range.setStartAfter(startTable);
    range.shrink();
  }
  const startBlock = range.startNode.closestBlock();
  const endBlock = range.endNode.closestBlock();
  const noMerge = startBlock.get(0) === endBlock.get(0);
  const nativeRange = range.get();
  nativeRange.deleteContents();
  if (noMerge) {
    const block = range.getBlocks()[0];
    if (block && block.isEmpty) {
      appendDeepest(block, query('<br />'));
      range.shrinkAfter(block);
    }
    return;
  }
  range.adaptBlock();
  const block = range.getBlocks()[0];
  if (!block) {
    return;
  }
  const prevBlock = block.prev();
  if (prevBlock.length === 0) {
    return;
  }
  const bookmark = insertBookmark(range);
  mergeNodes(prevBlock, block);
  toBookmark(range, bookmark);
  fixList(range);
}
