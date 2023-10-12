import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

function getTargetBlock(block: Nodes): Nodes {
  if (block.length === 0) {
    return block;
  }
  const parentBlock = block.parent();
  if (block.name === 'li' && parentBlock.isList) {
    return parentBlock;
  }
  return block;
}

// Returns target blocks relating to the specified range that can be modified by other operations.
export function getBlocks(range: Range): Nodes[] {
  const startBlock = getTargetBlock(range.startNode.closestBlock());
  const endBlock = getTargetBlock(range.endNode.closestBlock());
  if (
    startBlock.isEditable &&
    startBlock.get(0) &&
    startBlock.get(0) === endBlock.get(0)
  ) {
    return [ startBlock ];
  }
  const blocks: Nodes[] = [];
  const clonedRange = range.clone();
  clonedRange.collapseToEnd();
  for (const child of range.commonAncestor.getWalker()) {
    if (child.isBlock && child.isTopEditable &&
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
