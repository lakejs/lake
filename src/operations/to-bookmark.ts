import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

function removeAndNormalize(node: Nodes) {
  const previousNode = node.prev();
  const nextNode = node.next();
  if (previousNode.isText && nextNode.isText) {
    const parentNode = node.parent();
    node.remove();
    parentNode.get(0).normalize();
  } else {
    node.remove();
  }
}

export function toBookmark(range: Range, bookmark: { anchor: Nodes, focus: Nodes }): void {
  const anchor = bookmark.anchor;
  const focus = bookmark.focus;
  // Only the anchor is removed because the focus doesn't exist, which is not correct case.
  if (anchor.length > 0 && focus.length === 0) {
    removeAndNormalize(anchor);
    return;
  }
  if (focus.length > 0 && anchor.length === 0) {
    range.setStartAfter(focus);
    range.collapseToStart();
    removeAndNormalize(focus);
    return;
  }
  if (anchor.length > 0 && focus.length > 0) {
    const anchorRange = new Range();
    anchorRange.selectNode(anchor);
    // The anchor node is after the focus node.
    if (anchorRange.compareAfterPoint(focus) === -1) {
      range.setStartAfter(focus);
      removeAndNormalize(focus);
      range.setEndAfter(anchor);
      removeAndNormalize(anchor);
    } else {
      range.setStartAfter(anchor);
      removeAndNormalize(anchor);
      range.setEndAfter(focus);
      removeAndNormalize(focus);
    }
  }
}
