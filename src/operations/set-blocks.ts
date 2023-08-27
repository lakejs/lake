import { query, parseStyle, forEach } from '../utils';
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
    if (node.isMark || node.isText) {
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

function addStyles(block: Nodes, styleValue: string) {
  const cssProperties = parseStyle(styleValue);
  forEach(cssProperties, (key, val) => {
    block.css(key, val);
  });
}

// Adds new blocks or modifies target blocks relating to the specified range.
export function setBlocks(range: Range, value: string): void {
  const valueNode = query(value);
  const tagName = valueNode.name;
  const styleValue = valueNode.attr('style');
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
      addStyles(block, styleValue);
    }
    toBookmark(range, bookmark);
    return;
  }
  // no block
  const nonBlockNodes = getTopNonBlockNodes(range);
  if (nonBlockNodes.length > 0) {
    const bookmark = insertBookmark(range);
    const block = query(`<${tagName} />`);
    addStyles(block, styleValue);
    nonBlockNodes[0].before(block);
    nonBlockNodes.forEach((node, index) => {
      if (node.isText) {
        const nodeValue = node.get(0).nodeValue || '';
        if (index === 0) {
          node.get(0).nodeValue = nodeValue.replace(/^[\s\r\n]+/, '');
        } else if (index === nonBlockNodes.length - 1) {
          node.get(0).nodeValue = nodeValue.replace(/[\s\r\n]+$/, '');
        }
      }
      block.append(node);
    });
    toBookmark(range, bookmark);
  }
}
