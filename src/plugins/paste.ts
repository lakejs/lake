import type Editor from '..';
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
  if (block.text().trim() === '' && block.name === 'p') {
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
  const lastNode = new Nodes(fragment.lastChild);
  if (selection.getBlocks().length === 0) {
    selection.setBlocks('<p />');
  }
  if (firstNode.isBlock) {
    insertFirstNode(selection, firstNode);
  }
  if (fragment.childNodes.length > 0) {
    const parts = selection.splitBlock();
    if (parts.left) {
      range.setEndAfter(parts.left);
      range.collapseToEnd();
    }
    if (parts.right && parts.right.text().trim() === '') {
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
    const htmlParser = new HTMLParser(content);
    const fragment = htmlParser.getFragment();
    pasteFragment(editor, fragment);
  });
};
