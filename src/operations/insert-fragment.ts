import { removeBreak } from '../utils/remove-break';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { Fragment } from '../models/fragment';
import { deleteContents } from './delete-contents';

// Inserts the specified content into the range.
export function insertFragment(range: Range, content: string | DocumentFragment | Nodes | Fragment): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  let fragment: Fragment;
  if (typeof content === 'string' || content instanceof Nodes) {
    fragment = new Fragment();
    fragment.append(content);
  } else if (content instanceof Fragment) {
    fragment = content;
  } else {
    fragment = new Fragment(content);
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
