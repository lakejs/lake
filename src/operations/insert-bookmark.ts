import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

function insertNode(range: Range, node: Nodes): void {
  const nativeRange = range.get();
  const nativeNode = node.get(0);
  nativeRange.insertNode(nativeNode);
  nativeRange.setEndAfter(nativeNode);
  nativeRange.collapse(false);
}

// Inserts a bookmark at the cursor position or a pair of bookmarks at the beginning and end of the selected range.
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
