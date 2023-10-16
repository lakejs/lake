import { Range } from '../models/range';
import { deleteContents } from './delete-contents';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

// Inserts a DocumentFragment object into the specified range.
export function insertFragment(range: Range, fragment: DocumentFragment): void {
  if (!range.commonAncestor.isContentEditable) {
    return;
  }
  if (!range.isCollapsed) {
    deleteContents(range);
  }
  const bookmark = insertBookmark(range);
  bookmark.focus.before(fragment);
  toBookmark(range, bookmark);
}
