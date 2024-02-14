import type { Nodes } from '../models/nodes';

export function fixNumberedList(blocks: Nodes[]): void {
  if (blocks.length === 0) {
    return;
  }
  const firstBlock = blocks[0];
  const lastBlock = blocks[blocks.length - 1];
  const targetBlocks: Nodes[] = [];
  // to find all numbered list before current blocks
  let prevNode = firstBlock.prev();
  while (prevNode.length > 0) {
    if (prevNode.name !== 'ol') {
      break;
    }
    targetBlocks.push(prevNode);
    prevNode = prevNode.prev();
  }
  targetBlocks.reverse();
  targetBlocks.push(...blocks);
  // to find all numbered list after current blocks
  let nextNode = lastBlock.next();
  while (nextNode.length > 0) {
    if (nextNode.name !== 'ol') {
      break;
    }
    targetBlocks.push(nextNode);
    nextNode = nextNode.next();
  }
  // to reset start number
  let index = 1;
  for (const block of targetBlocks) {
    const prev = block.prev();
    if (prev.length === 0 || prev.name !== 'ol') {
      index = 1;
    }
    if (block.name === 'ol') {
      if (prev.name === 'ol' && prev.attr('indent') !== block.attr('indent')) {
        index = 1;
      }
      const currentStart = block.attr('start');
      const expectedStart = index.toString(10);
      if (currentStart !== expectedStart) {
        block.attr('start', expectedStart);
      }
      index++;
    }
  }
}
