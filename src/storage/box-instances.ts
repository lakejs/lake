import type { Box } from '../models/box';

const boxInstances = new Map<number, Map<number, Box>>();

export function getInstanceMap(id: number): Map<number, Box> {
  let instanceMap = boxInstances.get(id);
  if (!instanceMap) {
    instanceMap = new Map();
    boxInstances.set(id, instanceMap);
    return instanceMap;
  }
  return instanceMap;
}
