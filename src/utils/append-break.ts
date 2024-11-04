import type { Nodes } from '../models/nodes';
import { query } from './query';

// Appends a line break to the end of the specified block.
// Example:
// case 1: <p></p> to <p><br /></p>
// case 2: <p><br /></p> to <p><br /></p>
// case 3: <p>foo</p> to <p>foo<br /></p>
// case 4: <ul><li></li></ul> to <ul><li><br /></li></ul>
// case 5: <p><focus /></p> to <p><focus /><br /></p>
export function appendBreak(block: Nodes): Nodes {
  const breakNode = query('<br />');
  let child = block;
  while (child.isBlock) {
    let lastChild = child.last();
    while (lastChild.isText && lastChild.isEmpty) {
      lastChild = lastChild.prev();
    }
    if (!lastChild.isBlock && lastChild.name !== 'br') {
      child.append(breakNode);
      break;
    }
    child = lastChild;
  }
  return breakNode;
}
