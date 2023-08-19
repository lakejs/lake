import { NativeNode } from '../types/native';
import { getNodeList } from './get-node-list';
import { Nodes } from '../models/nodes';

export function query(content: string | NativeNode | Nodes) {
  if (content instanceof Nodes) {
    return content;
  }
  const nodes = getNodeList(content);
  return new Nodes(nodes);
}
