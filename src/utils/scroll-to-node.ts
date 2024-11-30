import { visibleInfo } from './visible-info';
import { Nodes } from '../models/nodes';

// If the specified node is not visible, scrolls the container that contains the node to its position to make it visible.
export function scrollToNode(node: Nodes, options?: ScrollIntoViewOptions): void {
  const visible = visibleInfo(node);
  if (
    visible.left !== 0 ||
    visible.right !== 0 ||
    visible.top !== 0 ||
    visible.bottom !== 0
  ) {
    (node.get(0) as Element).scrollIntoView(options);
  }
}
