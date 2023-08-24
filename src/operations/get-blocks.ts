import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Returns target blocks relating to the specified range that can be modified by other operations.
export function getBlocks(range: Range): Nodes[] {
  const startBlock = range.startNode.closestBlock();
  const endBlock = range.endNode.closestBlock();
  if (startBlock.get(0) && startBlock.get(0) === endBlock.get(0)) {
    return [ startBlock ];
  }
  const topBlocks = range.allTopBlocks();
  if (topBlocks.length > 0) {
    return topBlocks;
  }
  return range.allSiblingBlocks();
}
