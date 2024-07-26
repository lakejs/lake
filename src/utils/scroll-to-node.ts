import { nodePosition } from './node-position';
import { Nodes } from '../models/nodes';

// If a node is not visible, scrolls the container that contains this node to its position to make it visible.
// If the node is visible, then scrolling takes place.
export function scrollToNode(node: Nodes, options?: ScrollIntoViewOptions): void {
  const position = nodePosition(node);
  if (position.left < 0 || position.right < 0 || position.top < 0 || position.bottom < 0) {
    (node.get(0) as Element).scrollIntoView(options);
  }
}
