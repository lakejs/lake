import { Range } from '../models/range';

// Removes the text of the left part of the closest block divided into two parts by the start point of the range.
// "<p>one<anchor />two<focus />three</p>" returns "three".
export function removeLeftText(range: Range): void {
  const node = range.startNode;
  const offset = range.startOffset;
  let block = node.closestBlock();
  if (!block.isContentEditable) {
    block = node.closestContainer();
  }
  if (block.length === 0) {
    return;
  }
  const leftRange = new Range();
  leftRange.setStartBefore(block);
  leftRange.setEnd(node, offset);
  leftRange.get().deleteContents();
}
