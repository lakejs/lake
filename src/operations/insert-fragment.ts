import { removeBreak } from '../utils/remove-break';
import { Range } from '../models/range';
import { Fragment } from '../models/fragment';
import { deleteContents } from './delete-contents';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

// Inserts a document fragment object into the specified range.
export function insertFragment(range: Range, fragment: DocumentFragment | Fragment): void {
  if (fragment instanceof Fragment) {
    fragment = fragment.get();
  }
  if (range.commonAncestor.isOutside) {
    return;
  }
  if (range.isCollapsed) {
    range.adjustBox();
  } else {
    deleteContents(range);
  }
  const block = range.startNode.closestBlock();
  removeBreak(block);
  const bookmark = insertBookmark(range);
  bookmark.focus.before(fragment);
  toBookmark(range, bookmark);
  range.adjustBlock();
}
