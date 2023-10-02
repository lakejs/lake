import { KeyValue } from '../types/object';
import { query, parseStyle } from '../utils';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { getBlocks } from './get-blocks';
import { insertBookmark } from './insert-bookmark';
import { toBookmark } from './to-bookmark';

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
  if (!range.commonAncestor.isContentEditable) {
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
  const styleValue = valueNode.attr('style');
  const cssProperties = parseStyle(styleValue);
  const blockList = getBlocks(range);
  // has blocks
  if (blockList.length > 0) {
    const bookmark = insertBookmark(range);
    for (const node of blockList) {
      let block = node;
      if (node.name !== tagName) {
        block = query(`<${tagName} />`);
        let child = node.first();
        while(child.length > 0) {
          const next = child.next();
          block.append(child);
          child = next;
        }
        node.replaceWith(block);
      }
      block.css(cssProperties);
    }
    toBookmark(range, bookmark);
    return;
  }
  // no block
  const bookmark = insertBookmark(range);
  const nonBlockNodes = getTopNonBlockNodes(range);
  if (nonBlockNodes.length > 0) {
    const block = query(`<${tagName} />`);
    block.css(cssProperties);
    nonBlockNodes[0].before(block);
    nonBlockNodes.forEach((node, index) => {
      if (node.isText) {
        if (index === 0) {
          const nodeValue = node.text().replace(/^[\s\r\n]+/, '');
          if (node.text() !== nodeValue) {
            node.get(0).nodeValue = nodeValue;
          }
        } else if (index === nonBlockNodes.length - 1) {
          const nodeValue = node.text().replace(/[\s\r\n]+$/, '');
          if (node.text() !== nodeValue) {
            node.get(0).nodeValue = nodeValue;
          }
        }
      }
      block.append(node);
    });
  }
  toBookmark(range, bookmark);
}
