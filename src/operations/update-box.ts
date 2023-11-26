import { BoxDefinition } from '../types/box';
import { Range } from '../models/range';
import { Box } from '../models/box';

// Update a box at the beginning of the specified range.
export function updateBox(range: Range, def: BoxDefinition): void {
  const boxNode = range.startNode.closest('lake-box');
  if (boxNode.length === 0) {
    return;
  }
  const box = new Box(boxNode);
  if (box.type !== def.type) {
    box.type = def.type;
  }
  if (def.value) {
    box.value = def.value;
    box.render();
  }
}
