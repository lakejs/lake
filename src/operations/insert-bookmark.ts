import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertContents } from './insert-contents';

// Either the method inserts a bookmark into the current position of the collapsed range
// or the method inserts a pair of bookmarks into the beginning and the end of the range.
export function insertBookmark(range: Range): { anchor: Nodes, focus: Nodes } {
  if (!range.commonAncestor.isContentEditable) {
    return {
      anchor: new Nodes(),
      focus: new Nodes(),
    };
  }
  if (range.isCollapsed) {
    const endRange = range.clone().collapseToEnd();
    const focus = insertContents(endRange, '<bookmark type="focus" />');
    return {
      anchor: new Nodes(),
      focus,
    };
  }
  const startRange = range.clone().collapseToStart();
  const anchor = insertContents(startRange, '<bookmark type="anchor" />');
  const endRange = range.clone().collapseToEnd();
  const focus = insertContents(endRange, '<bookmark type="focus" />');
  return {
    anchor,
    focus,
  };
}
