import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

export function toBookmark(range: Range, bookmark: { anchor: Nodes, focus: Nodes }): void {
  const anchor = bookmark.anchor;
  const focus = bookmark.focus;
  if (anchor.length > 0 && focus.length === 0) {
    range.setStartAfter(anchor);
    range.collapseToStart();
    anchor.remove();
    return;
  }
  if (focus.length > 0 && anchor.length === 0) {
    range.setStartAfter(focus);
    range.collapseToStart();
    anchor.remove();
    return;
  }
  if (anchor.length > 0 && focus.length > 0) {
    range.setStartAfter(anchor);
    anchor.remove();
    range.setEndAfter(focus);
    focus.remove();
  }
}
