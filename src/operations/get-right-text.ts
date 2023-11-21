import { query } from '../utils/query';
import { Range } from '../models/range';

// Returns the text of the right part of the closest block divided into two parts by the end point of the range.
// "<p>one<anchor />two<focus />three</p>" returns "three".
export function getRightText(range: Range): string {
  const node = range.endNode;
  const offset = range.endOffset;
  let block = node.closestBlock();
  if (block.isOutside) {
    block = node.closestContainer();
  }
  if (block.length === 0) {
    return '';
  }
  const rightRange = new Range();
  rightRange.setStart(node, offset);
  rightRange.setEndAfter(block);
  const container = query('<div />');
  container.append(rightRange.cloneContents());
  const text = container.text();
  return text;
}
