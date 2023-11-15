import { query } from '../utils';
import { Range } from '../models/range';
import { insertFragment } from './insert-fragment';

// Inserts a HTML string into the specified range.
export function insertContents(range: Range, value: string): void {
  const nodes = query(value);
  const fragment = document.createDocumentFragment();
  nodes.each(nativeNode => {
    fragment.appendChild(nativeNode);
  });
  insertFragment(range, fragment);
}
