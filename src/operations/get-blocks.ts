import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Returns target blocks relating to the specified range that can be modified by other operations.
export function getBlocks(range: Range): Nodes[] {
  if (range.isCollapsed) {
    const startBlock = range.startNode.closestOperableBlock();
    return startBlock.isInside ? [ startBlock ] : [];
  }
  const startBlock = range.startNode.closestOperableBlock();
  const endBlock = range.endNode.closestOperableBlock();
  if (
    startBlock.isInside &&
    startBlock.get(0) &&
    startBlock.get(0) === endBlock.get(0)
  ) {
    return [ startBlock ];
  }
  const blocks: Nodes[] = [];
  const clonedRange = range.clone();
  clonedRange.collapseToEnd();
  for (const child of range.commonAncestor.getWalker()) {
    if (child.isBlock && child.isTopInside &&
      // the range doesn't end at the start of a block
      clonedRange.comparePoint(child, 0) !== 0 &&
      range.intersectsNode(child)
    ) {
      blocks.push(child);
    }
  }
  if (blocks.length > 0) {
    return blocks;
  }
  for (const child of range.commonAncestor.getWalker()) {
    if (child.isBlock &&
      (startBlock.isSibling(child) || endBlock.isSibling(child)) &&
      range.intersectsNode(child)) {
      blocks.push(child);
    }
  }
  return blocks;
}
