import { NativeNode } from '../types/native';
import { boxInstances } from '../storage/box-instances';
import { query } from './query';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

// Returns an already generated box instance or generates a new instance if it does not exist.
export function getBox(boxNode: string | Nodes | NativeNode): Box {
  if (typeof boxNode === 'string') {
    return new Box(boxNode);
  }
  boxNode = query(boxNode);
  const container = boxNode.closestContainer();
  if (container.length === 0) {
    return new Box(boxNode);
  }
  let instanceMap = boxInstances.get(container.id);
  if (!instanceMap) {
    instanceMap = new Map();
    boxInstances.set(container.id, instanceMap);
  }
  let box = instanceMap.get(boxNode.id);
  if (box) {
    return box;
  }
  box = new Box(boxNode);
  instanceMap.set(box.node.id, box);
  return box;
}
