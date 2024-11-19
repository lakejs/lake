import { getBox } from '../utils/get-box';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

function removeAndNormalizeNode(node: Nodes, range?: Range): void {
  const previousNode = node.prev();
  const nextNode = node.next();
  if (previousNode.isText || nextNode.isText) {
    const parentNode = node.parent();
    node.remove();
    parentNode.get(0).normalize();
  } else if (previousNode.length === 0 && nextNode.length === 0) {
    if (node.parent().isMark && range) {
      const zeroWidthSpace = new Nodes(document.createTextNode('\u200B'));
      node.before(zeroWidthSpace);
      range.setStartAfter(zeroWidthSpace);
      range.collapseToStart();
    }
    node.remove();
  } else {
    node.remove();
  }
}

// Changes the specified range to the range represented by the bookmark.
export function toBookmark(range: Range, bookmark: { anchor: Nodes, focus: Nodes }): void {
  const anchor = bookmark.anchor;
  const focus = bookmark.focus;
  // Only the anchor is removed because the focus does not exist, which is not correct case.
  if (anchor.length > 0 && focus.length === 0) {
    removeAndNormalizeNode(anchor);
    return;
  }
  if (focus.length > 0 && anchor.length === 0) {
    if (focus.isBox) {
      const box = getBox(focus);
      if (box.getContainer().length === 0) {
        box.render();
      }
      const focusValue = focus.attr('focus');
      if (focusValue === 'start') {
        range.selectBoxStart(focus);
      } else if (focusValue === 'center') {
        range.selectBox(focus);
      } else {
        range.selectBoxEnd(focus);
      }
      focus.removeAttr('focus');
      return;
    }
    range.setStartBefore(focus);
    range.collapseToStart();
    removeAndNormalizeNode(focus, range);
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
