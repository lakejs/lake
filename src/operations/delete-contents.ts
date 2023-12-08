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
  range.adapt();
  const nativeRange = range.get();
  nativeRange.deleteContents();
  range.adapt();
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
