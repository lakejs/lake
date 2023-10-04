import { Nodes } from '../models/nodes';

// Removes Zero-width spaces that are dependent on some other text nodes.
export function removeZWS(node: Nodes) {
  for (const child of node.getWalker()) {
    if (child.isText && child.text().length > 1) {
      const nodeValue = child.text();
      if (/\u200B/.test(child.text())) {
        child.get(0).nodeValue = nodeValue.replace(/\u200B/g, '');
      }
    }
  }
}
