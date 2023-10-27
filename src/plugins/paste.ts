import type Editor from '..';
import { getDefaultRules } from '../constants/schema';
import { forEach } from '../utils';
import { HTMLParser, TextParser, Nodes, Selection } from '../models';

function insertFirstNode(selection: Selection, otherNode: Nodes): void {
  const range = selection.range;
  const block = range.startNode.closestBlock();
  // <p><br /></p>
  if (
    block.first().length > 0 && block.first().get(0) === block.last().get(0) &&
    block.first().name === 'br' && otherNode.first().length > 0
  ) {
    block.empty();
  }
  if (block.hasEmptyText && block.name === 'p') {
    block.replaceWith(otherNode);
    range.selectAfterNodeContents(otherNode);
    return;
  }
  let child = otherNode.first();
  while(child.length > 0) {
    if (child.name === 'li') {
      child = child.first();
    }
    const nextSibling = child.next();
    selection.insertNode(child);
    child = nextSibling;
  }
  otherNode.remove();
}

function pasteFragment(editor: Editor, fragment: DocumentFragment): void {
  const selection = editor.selection;
  const range = selection.range;
  if (fragment.childNodes.length === 0) {
    return;
  }
  const firstNode = new Nodes(fragment.firstChild);
  let lastNode = new Nodes(fragment.lastChild);
  if (selection.getBlocks().length === 0) {
    selection.setBlocks('<p />');
  }
  // remove br element
  const block = range.startNode.closestBlock();
  if (block.length > 0 && block.hasEmptyText) {
    block.empty();
  }
  // is mark or text
  if (!firstNode.isBlock) {
    selection.insertFragment(fragment);
    return;
  }
  // is block
  if (firstNode.isBlock) {
    insertFirstNode(selection, firstNode);
  }
  // remove br
  let child = new Nodes(fragment.firstChild);
  while (child.length > 0) {
    const next = child.next();
    if (child.name === 'br') {
      child.remove();
    }
    child = next;
  }
  lastNode = new Nodes(fragment.lastChild);
  // insert fragment
  if (fragment.childNodes.length > 0) {
    const parts = selection.splitBlock();
    if (parts.left) {
      range.setEndAfter(parts.left);
      range.collapseToEnd();
    }
    if (parts.right && parts.right.hasEmptyText) {
      parts.right.remove();
    }
    selection.insertFragment(fragment);
    range.selectAfterNodeContents(lastNode);
  }
}

export default (editor: Editor) => {
  editor.container.on('paste', event => {
    event.preventDefault();
    const dataTransfer = (event as ClipboardEvent).clipboardData;
    if (!dataTransfer) {
      return;
    }
    editor.selection.deleteContents();
    const types = dataTransfer.types;
    const isPlainText = (types.length === 1 && types[0] === 'text/plain');
    if (isPlainText) {
      const content = dataTransfer.getData('text/plain');
      const textParser = new TextParser(content);
      const fragment = textParser.getFragment();
      pasteFragment(editor, fragment);
      return;
    }
    const content = dataTransfer.getData('text/html');
    const rules = getDefaultRules();
    forEach(rules, (key, attributeRules) => {
      delete attributeRules.id;
      delete attributeRules.class;
    });
    const htmlParser = new HTMLParser(content, rules);
    const fragment = htmlParser.getFragment();
    pasteFragment(editor, fragment);
  });
};
