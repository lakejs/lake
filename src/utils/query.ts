import { toNodeList } from './to-node-list';
import { Nodes } from '../models/nodes';

// Returns a Nodes object representing a list of the document's nodes.
export function query(content: string | Node | Nodes): Nodes {
  if (content instanceof Nodes) {
    return content;
  }
  const nodes = toNodeList(content);
  return new Nodes(nodes);
}
