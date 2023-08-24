import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

// Traverses the first node and its parents until it finds a block element.
function getClosestBlock(node: Nodes) {
  while (node.length > 0) {
    if (node.isTopEditable || node.isBlock) {
      break;
    }
    node = node.parent();
  }
  if (!node.isBlock) {
    return new Nodes();
  }
  return node;
}

function isSibling(node: Nodes, targetNode: Nodes): boolean {
  return node.parent().get(0) && node.parent().get(0) === targetNode.parent().get(0);
}

// Returns target blocks relating to the specified range that can be modified by other operations.
export function getBlocks(range: Range): Nodes[] {
  const blockList: Nodes[] = [];
  const startBlock = getClosestBlock(range.startNode);
  const endBlock = getClosestBlock(range.endNode);
  if (startBlock.get(0) && startBlock.get(0) === endBlock.get(0)) {
    blockList.push(startBlock);
    return blockList;
  }
  const allBlocks = range.allBlocks();
  allBlocks.forEach(node => {
    if (node.isTopEditable) {
      blockList.push(node);
    }
  });
  if (blockList.length > 0) {
    return blockList;
  }
  allBlocks.forEach(node => {
    if (isSibling(startBlock, node) || isSibling(endBlock, node)) {
      blockList.push(node);
    }
  });
  return blockList;
}
