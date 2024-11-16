import { KeyValue } from '../types/object';
import { query } from '../utils/query';
import { getDeepElement } from '../utils/get-deep-element';
import { wrapNodeList } from '../utils/wrap-node-list';
import { appendBreak } from '../utils/append-break';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';
import { fixList } from './fix-list';

function getTopNonBlockNodes(range: Range): Nodes[] {
  const container = range.commonAncestor.closest('div[contenteditable="true"],td');
  let nodeList: Nodes[] = [];
  if (container.length === 0) {
    return nodeList;
  }
  let node = container.first();
  let isBeforeRange = true;
  while (node.length > 0) {
    if (node.isMark || node.isText || node.isBookmark || node.isInlineBox) {
      nodeList.push(node);
    } else {
      if (!isBeforeRange) {
        break;
      }
      nodeList = [];
    }
    if (range.intersectsNode(node)) {
      isBeforeRange = false;
    }
    node = node.next();
  }
  return nodeList;
}

// Adds new blocks or changes target blocks in the specified range.
export function setBlocks(range: Range, value: string | KeyValue): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  if (range.isCollapsed) {
    const boxNode = range.commonAncestor.closest('lake-box');
    if (boxNode.isBlockBox) {
      return;
    }
  }
  // changes the attributes of target blocks
  if (typeof value !== 'string') {
    const blockList = range.getBlocks();
    for (const block of blockList) {
      block.css(value);
    }
    return;
  }
  // adds or replace blocks
  const valueNode = query(value);
  const tagName = valueNode.name;
  const nativeValueNode = valueNode.get(0) as Element;
  const attributes = nativeValueNode.attributes;
  const blockList = range.getBlocks();
  // has blocks
  if (blockList.length > 0) {
    const bookmark = insertBookmark(range);
    for (const node of blockList) {
      if (node.name === tagName && valueNode.first().length === 0) {
        for (const attr of attributes) {
          node.attr(attr.name, attr.value);
        }
      } else {
        const block = valueNode.clone(true);
        if (block.isList && node.isList && node.attr('indent') !== '') {
          block.attr('indent', node.attr('indent'));
        }
        const deepestBlock = getDeepElement(block);
        let child = node.first();
        while(child.length > 0) {
          const nextNode = child.next();
          deepestBlock.append(child);
          if (deepestBlock.name === child.name || child.name === 'li') {
            child.remove(true);
          }
          child = nextNode;
        }
        node.replaceWith(block);
      }
    }
    toBookmark(range, bookmark);
    fixList(range);
    return;
  }
  // no block
  if (range.isCollapsed) {
    const nextNode = range.getNextNode();
    if (nextNode.name === 'br') {
      const newBlock = query('<p><br /></p>');
      nextNode.replaceWith(newBlock);
      range.shrinkBefore(newBlock);
      return;
    }
    const prevNode = range.getPrevNode();
    if (prevNode.name === 'br') {
      const newBlock = query('<p><br /></p>');
      prevNode.replaceWith(newBlock);
      range.shrinkBefore(newBlock);
      return;
    }
  }
  const bookmark = insertBookmark(range);
  const nonBlockNodes = getTopNonBlockNodes(range);
  const block = wrapNodeList(nonBlockNodes, valueNode);
  toBookmark(range, bookmark);
  fixList(range);
  if (block.isEmpty) {
    const breakNode = appendBreak(block);
    range.setStartBefore(breakNode);
    range.collapseToStart();
  }
}
