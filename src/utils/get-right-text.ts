import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { query } from './query';

// Returns the text of the right part of the closest block divided into two parts by the node and the offset.
// "<p>one<anchor />two<focus />three</p>" returns "three".
export function getRightText(node: Nodes, offset: number): string {
  let block = node.closestBlock();
  if (!block.isContentEditable) {
    block = node.closestContainer();
  }
  if (block.length === 0) {
    return '';
  }
  const range = new Range();
  range.setStart(node, offset);
  range.setEndAfter(block);
  const container = query('<div />');
  container.get(0).appendChild(range.cloneContents());
  const text = container.text();
  return text;
}
