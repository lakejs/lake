import morphdom from 'morphdom';
import type { Nodes } from '../models/nodes';

export function diff(
  node: Nodes,
  otherNode: Nodes,
  options?: Parameters<typeof morphdom>[2],
): ReturnType<typeof morphdom> {
  return morphdom(node.get(0), otherNode.get(0), options);
}
