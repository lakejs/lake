import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

export function getBlocks(range: Range): Nodes[] {
  const blockList: Nodes[] = [];
  range.allNodes().forEach(node => {
    if (node.isBlock) {
      blockList.push(node);
    }
  });
  if (blockList.length === 0) {
    let parent = range.commonAncestor;
    while (parent.length > 0) {
      if (parent.isElement && !parent.isEditable) {
        break;
      }
      if (parent.isBlock) {
        blockList.push(parent);
        break;
      }
      parent = parent.parent();
    }
  }
  return blockList;
}
