import { Range } from '../models/range';
import { deleteContents } from './delete-contents';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

// Inserts a DocumentFragment object into the specified range.
export function insertFragment(range: Range, fragment: DocumentFragment): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  if (range.isCollapsed) {
    range.adaptBox();
  } else {
    deleteContents(range);
  }
  const bookmark = insertBookmark(range);
  bookmark.focus.before(fragment);
  toBookmark(range, bookmark);
  range.adaptBlock();
}
