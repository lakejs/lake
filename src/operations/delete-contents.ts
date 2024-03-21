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
  range.adaptTable();
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
