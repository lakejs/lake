import type { Nodes } from '../models/nodes';

// Removes Zero-width spaces from text nodes.
export function removeZWS(node: Nodes): void {
  for (const child of node.getWalker()) {
    if (child.isText) {
      const text = child.text();
      if (text === '') {
        child.remove();
      } else if (text.length > 1) {
        if (/\u200B/.test(text)) {
          child.get(0).nodeValue = text.replace(/\u200B/g, '');
        }
      }
    }
  }
}
