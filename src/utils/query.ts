import { NativeNode } from '../types/native';
import { getNodeList } from './get-node-list';
import { Nodes } from '../models/nodes';

export function query(value: string | NativeNode | Nodes) {
  if (value instanceof Nodes) {
    return value;
  }
  const nodes = getNodeList(value);
  return new Nodes(nodes);
}
