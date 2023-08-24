import { NativeNode } from '../types/native';
import { toNodeList } from './to-node-list';
import { Nodes } from '../models/nodes';

export function query(content: string | NativeNode | Nodes) {
  if (content instanceof Nodes) {
    return content;
  }
  const nodes = toNodeList(content);
  return new Nodes(nodes);
}
