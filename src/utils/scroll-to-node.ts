import { isVisible } from './is-visible';
import { Nodes } from '../models/nodes';

// If a node is not visible, scrolls the container that contains this node to its position to make it visible.
// If the node is visible, then scrolling takes place.
export function scrollToNode(node: Nodes, options?: ScrollIntoViewOptions): void {
  const visible = isVisible(node);
  if (!visible.left || !visible.right || !visible.top || !visible.bottom) {
    (node.get(0) as Element).scrollIntoView(options);
  }
}
