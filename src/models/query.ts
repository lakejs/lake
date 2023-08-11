import { NativeElement, NativeNode } from '../types/native';
import { getNodeList } from '../utils';
import { ElementList } from './element-list';

export function query(value: string | NativeNode | ElementList) {
  if (value instanceof ElementList) {
    return value;
  }
  const nodes = getNodeList(value);
  const elements = nodes.filter((node: NativeNode) => {
    return node.nodeType === NativeNode.ELEMENT_NODE;
  });
  return new ElementList(elements as NativeElement[]);
}
