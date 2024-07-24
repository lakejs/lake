import { nodeAndView } from '../utils/node-and-view';
import { Nodes } from '../models/nodes';

export function scrollToNode(node: Nodes, options?: ScrollIntoViewOptions): void {
  const position = nodeAndView(node);
  if (position.left < 0 || position.right < 0 || position.top < 0 || position.bottom < 0) {
    (node.get(0) as Element).scrollIntoView(options);
  }
}
