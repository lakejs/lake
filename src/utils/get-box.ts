import { NativeNode } from '../types/native';
import { boxInstances } from '../storage/box-instances';
import { query } from './query';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

function getInstanceMap(id: number): Map<number, Box> {
  let instanceMap = boxInstances.get(id);
  if (!instanceMap) {
    instanceMap = new Map();
    boxInstances.set(id, instanceMap);
    return instanceMap;
  }
  return instanceMap;
}

// Returns an already generated box instance or generates a new instance if it does not exist.
export function getBox(boxNode: string | Nodes | NativeNode): Box {
  const tempInstanceMap = getInstanceMap(0);
  // boxNode is a name
  if (typeof boxNode === 'string') {
    const box = new Box(boxNode);
    tempInstanceMap.set(box.node.id, box);
    return box;
  }
  // boxNode is node
  boxNode = query(boxNode);
  const container = boxNode.closestContainer();
  if (container.length === 0) {
    let box = tempInstanceMap.get(boxNode.id);
    if (box) {
      return box;
    }
    box = new Box(boxNode);
    tempInstanceMap.set(boxNode.id, box);
    return box;
  }
  const instanceMap = getInstanceMap(container.id);
  let box = tempInstanceMap.get(boxNode.id);
  if (box) {
    instanceMap.set(boxNode.id, box);
    tempInstanceMap.delete(boxNode.id);
    return box;
  }
  box = instanceMap.get(boxNode.id);
  if (box) {
    return box;
  }
  box = new Box(boxNode);
  instanceMap.set(boxNode.id, box);
  return box;
}
