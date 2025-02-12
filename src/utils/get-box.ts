import { getInstanceMap } from '../storage/box-instances';
import { query } from './query';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

/**
 * Returns an existing Box instance associated with the provided boxNode or generates a new one if none exists.
 * The function handles the creation and storage of Box instances, storing them either in a temporary or
 * permanentmap based on whether the boxNode is contained within a container.
 */
export function getBox(boxNode: string | Node | Nodes): Box {
  const tempInstanceMap = getInstanceMap(0);
  // boxNode is a name
  if (typeof boxNode === 'string') {
    const box = new Box(boxNode);
    tempInstanceMap.set(box.node.id, box);
    return box;
  }
  // boxNode is a node
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
    // move the box instance from temporary map to permanent map
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
