import { removeBreak } from '../utils/remove-break';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { Fragment } from '../models/fragment';
import { deleteContents } from './delete-contents';

// Inserts the specified contents into the range.
export function insertContents(range: Range, contents: string | DocumentFragment | Nodes | Fragment): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  let fragment: Fragment;
  if (typeof contents === 'string' || contents instanceof Nodes) {
    fragment = new Fragment();
    fragment.append(contents);
  } else if (contents instanceof Fragment) {
    fragment = contents;
  } else {
    fragment = new Fragment(contents);
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
