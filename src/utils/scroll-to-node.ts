import { isVisible } from './is-visible';
import { Nodes } from '../models/nodes';

// If the specified node is not visible, scrolls the container that contains the node to its position to make it visible.
export function scrollToNode(node: Nodes, options?: ScrollIntoViewOptions): void {
  const visible = isVisible(node);
  if (!visible.left || !visible.right || !visible.top || !visible.bottom) {
    (node.get(0) as Element).scrollIntoView(options);
  }
}
