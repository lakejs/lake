import { KeyValue } from '../types/object';
import { NativeElement } from '../types/native';
import { query, getDeepest, wrapNodeList, appendDeepest } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { getBlocks } from './get-blocks';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';
import { fixList } from './fix-list';

function getTopNonBlockNodes(range: Range): Nodes[] {
  const container = range.commonAncestor.closestContainer();
  let nodeList: Nodes[] = [];
  if (container.length === 0) {
    return nodeList;
  }
  let node = container.first();
  let isBeforeRange = true;
  while (node.length > 0) {
    if (node.isMark || node.isText || node.isBookmark) {
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

// Adds new blocks or changes target blocks relating to the specified range.
export function setBlocks(range: Range, value: string | KeyValue): void {
  if (range.commonAncestor.isOutside) {
    return;
  }
  // changes the attributes of target blocks
  if (typeof value !== 'string') {
    const blockList = getBlocks(range);
    for (const block of blockList) {
      block.css(value);
    }
    return;
  }
  // adds or replace blocks
  const valueNode = query(value);
  const tagName = valueNode.name;
  const nativeValueNode = valueNode.get(0) as NativeElement;
  const attributes = nativeValueNode.attributes;
  const blockList = getBlocks(range);
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
        const deepestBlock = getDeepest(block);
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
  const bookmark = insertBookmark(range);
  const nonBlockNodes = getTopNonBlockNodes(range);
  const block = wrapNodeList(nonBlockNodes, valueNode);
  toBookmark(range, bookmark);
  fixList(range);
  if (block.isEmpty) {
    const br = query('<br />');
    appendDeepest(block, br);
    range.setEndAfter(br);
    range.collapseToEnd();
  }
}
