import type LakeCore from '..';
import { Nodes } from '../models/nodes';

function adjustStartAttributes(editor: LakeCore): void {
  const blocks = editor.selection.getBlocks();
  if (blocks.length === 0) {
    return;
  }
  const firstBlock = blocks[0];
  const lastBlock = blocks[blocks.length - 1];
  let targetBlocks: Nodes[] = [];
  // to find all numbered list before current blocks
  let prevNode = firstBlock.prev();
  while (prevNode.length > 0) {
    if (prevNode.name !== 'ol') {
      break;
    }
    targetBlocks.push(prevNode);
    prevNode = prevNode.prev();
  }
  targetBlocks = targetBlocks.reverse();
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
    if (block.name !== 'ol') {
      index = 1;
    } else {
      const currentStart = block.attr('start');
      const expectedStart = index.toString(10);
      if (currentStart !== expectedStart) {
        block.attr('start', expectedStart);
      }
      index++;
    }
  }
}

export default (editor: LakeCore) => {
  editor.command.add('list', (type: 'numbered' | 'bulleted' | 'checklist') => {
    editor.focus();
    const blocks = editor.selection.getBlocks();
    let isNumberedList = false;
    let isBulletedList = false;
    for (const block of blocks) {
      if (!isNumberedList && block.name === 'ol') {
        isNumberedList = true;
      }
      if (!isBulletedList && block.name === 'ul') {
        isBulletedList = true;
      }
    }
    if (isNumberedList) {
      if (type === 'numbered') {
        editor.selection.setBlocks('<p />');
      }
      if (type === 'bulleted') {
        editor.selection.setBlocks('<ul><li></li></ul>');
      }
    } else if (isBulletedList) {
      if (type === 'numbered') {
        editor.selection.setBlocks('<ol><li></li></ol>');
      }
      if (type === 'bulleted') {
        editor.selection.setBlocks('<p />');
      }
    } else {
      if (type === 'numbered') {
        editor.selection.setBlocks('<ol><li></li></ol>');
      }
      if (type === 'bulleted') {
        editor.selection.setBlocks('<ul><li></li></ul>');
      }
    }
    adjustStartAttributes(editor);
    editor.history.save();
    editor.select();
  });
};
