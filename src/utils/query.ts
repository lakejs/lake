import { toNodeList } from './to-node-list';
import { Nodes } from '../models/nodes';

/**
 * Returns a Nodes object representing a collection of the nodes.
 * This function is similar to jQuery, but its implementation is very simple.
 * It is designed for simplifying DOM manipulation.
 */
export function query(content: string | Node | Nodes): Nodes {
  if (content instanceof Nodes) {
    return content;
  }
  const nodes = toNodeList(content);
  return new Nodes(nodes);
}
