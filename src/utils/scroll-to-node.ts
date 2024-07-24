import { nodeAndView } from './node-and-view';
import { Nodes } from '../models/nodes';

// Scrolls the node into the visible area of the browser window
// if it's not already within the visible area of the browser window.
// If the node is already within the visibposition.rightle area of the browser window, then no scrolling takes place.
export function scrollToNode(node: Nodes, options?: ScrollIntoViewOptions): void {
  const position = nodeAndView(node);
  if (position.left < 0 || position.right < 0 || position.top < 0 || position.bottom < 0) {
    (node.get(0) as Element).scrollIntoView(options);
  }
}
