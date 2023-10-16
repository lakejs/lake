import { query } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { deleteContents } from './delete-contents';
import { insertFragment } from './insert-fragment';

// Inserts a HTML string into the specified range.
export function insertContents(range: Range, value: string): Nodes {
  const nodes = query(value);
  if (!range.commonAncestor.isContentEditable) {
    return nodes;
  }
  if (!range.isCollapsed) {
    deleteContents(range);
  }
  const fragment = document.createDocumentFragment();
  nodes.each(nativeNode => {
    fragment.appendChild(nativeNode);
  });
  insertFragment(range, fragment);
  return nodes;
}
