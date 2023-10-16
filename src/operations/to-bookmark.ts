import { removeZWS } from '../utils/remove-zws';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

function removeAndNormalizeNode(node: Nodes) {
  const previousNode = node.prev();
  const nextNode = node.next();
  if (previousNode.isText && nextNode.isText) {
    const parentNode = node.parent();
    removeZWS(parentNode);
    node.remove();
    parentNode.get(0).normalize();
  } else {
    node.remove();
  }
}

// Sets the specified range to the range represented by the bookmark.
export function toBookmark(range: Range, bookmark: { anchor: Nodes, focus: Nodes }): void {
  const anchor = bookmark.anchor;
  const focus = bookmark.focus;
  // Only the anchor is removed because the focus doesn't exist, which is not correct case.
  if (anchor.length > 0 && focus.length === 0) {
    removeAndNormalizeNode(anchor);
    return;
  }
  if (focus.length > 0 && anchor.length === 0) {
    range.setStartBefore(focus);
    range.collapseToStart();
    removeAndNormalizeNode(focus);
    return;
  }
  if (anchor.length > 0 && focus.length > 0) {
    const anchorRange = new Range();
    anchorRange.selectNode(anchor);
    anchorRange.collapseToEnd();
    // The anchor node is after the focus node.
    if (anchorRange.compareAfterNode(focus) === -1) {
      range.setStartBefore(focus);
      removeAndNormalizeNode(focus);
      range.setEndBefore(anchor);
      removeAndNormalizeNode(anchor);
    } else {
      range.setStartBefore(anchor);
      removeAndNormalizeNode(anchor);
      range.setEndBefore(focus);
      removeAndNormalizeNode(focus);
    }
  }
}
