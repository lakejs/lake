import { removeBreak } from '../utils/remove-break';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { Fragment } from '../models/fragment';
import { deleteContents } from './delete-contents';

/**
 * Inserts the specified contents into the range.
 */
export function insertContents(range: Range, contents: string | Node | DocumentFragment | Nodes | Fragment): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  let fragment: Fragment;
  if (contents instanceof Fragment) {
    fragment = contents;
  } else if (contents instanceof DocumentFragment) {
    fragment = new Fragment(contents);
  } else {
    fragment = new Fragment();
    fragment.append(contents);
  }
  if (range.isCollapsed) {
    range.adjustBox();
  } else {
    deleteContents(range);
  }
  const block = range.startNode.closestBlock();
  removeBreak(block);
  const nativeRange = range.get();
  nativeRange.insertNode(fragment.get());
  nativeRange.collapse(false);
  range.adjustBlock();
}
