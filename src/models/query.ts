import { NativeNode } from '../types/native';
import { getNodeList } from '../utils';
import { Nodes } from './nodes';

export function query(value: string | NativeNode | Nodes) {
  if (value instanceof Nodes) {
    return value;
  }
  const nodes = getNodeList(value);
  return new Nodes(nodes);
}
