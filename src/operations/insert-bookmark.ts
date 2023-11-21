import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertNode } from './insert-node';

// Either the method inserts a bookmark into the current position of the collapsed range
// or the method inserts a pair of bookmarks into the beginning and the end of the range.
export function insertBookmark(range: Range): { anchor: Nodes, focus: Nodes } {
  if (range.commonAncestor.isOutside) {
    return {
      anchor: new Nodes(),
      focus: new Nodes(),
    };
  }
  if (range.isCollapsed) {
    const endRange = range.clone().collapseToEnd();
    const focus = query('<lake-bookmark type="focus" />');
    insertNode(endRange, focus);
    return {
      anchor: new Nodes(),
      focus,
    };
  }
  const startRange = range.clone().collapseToStart();
  const anchor = query('<lake-bookmark type="anchor" />');
  insertNode(startRange, anchor);
  const endRange = range.clone().collapseToEnd();
  const focus = query('<lake-bookmark type="focus" />');
  insertNode(endRange, focus);
  return {
    anchor,
    focus,
  };
}
