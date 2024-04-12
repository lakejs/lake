import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertNode } from './insert-node';

// Either the method inserts a bookmark into the current position of the collapsed range
// or the method inserts a pair of bookmarks into the beginning and the end of the range.
// case 1: foo<lake-bookmark type="focus" />bar
// case 2: <lake-bookmark type="anchor" />foo<lake-bookmark type="focus" />
// case 3: foo<lake-box type="inline" name="image" focus="start"></lake-box>bar
// case 4: foo<lake-box type="inline" name="image" focus="end"></lake-box>bar
// case 5: <lake-bookmark type="anchor" /><lake-box type="inline" name="image"></lake-box>foo<lake-bookmark type="focus" />
export function insertBookmark(range: Range): { anchor: Nodes, focus: Nodes } {
  if (range.commonAncestor.isOutside) {
    return {
      anchor: new Nodes(),
      focus: new Nodes(),
    };
  }
  // box
  const boxNode = range.startNode.closest('lake-box');
  if (boxNode.length > 0) {
    if (range.isBoxStart) {
      boxNode.attr('focus', 'start');
    } else if (range.isBoxEnd) {
      boxNode.attr('focus', 'end');
    } else {
      boxNode.attr('focus', 'center');
    }
    return {
      anchor: new Nodes(),
      focus: boxNode,
    };
  }
  // collapsed range
  if (range.isCollapsed) {
    const endRange = range.clone();
    endRange.collapseToEnd();
    const focus = query('<lake-bookmark type="focus" />');
    insertNode(endRange, focus);
    return {
      anchor: new Nodes(),
      focus,
    };
  }
  // expanded range
  const startRange = range.clone();
  startRange.collapseToStart();
  const anchor = query('<lake-bookmark type="anchor" />');
  insertNode(startRange, anchor);
  const endRange = range.clone();
  endRange.collapseToEnd();
  const focus = query('<lake-bookmark type="focus" />');
  insertNode(endRange, focus);
  return {
    anchor,
    focus,
  };
}
