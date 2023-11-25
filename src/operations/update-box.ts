import { BoxData } from '../types/box';
import { Range } from '../models/range';
import { Box } from '../models/box';

// Update a box at the beginning of the specified range.
export function updateBox(range: Range, data: BoxData): void {
  const boxNode = range.startNode.closest('lake-box');
  if (boxNode.length === 0) {
    return;
  }
  const box = new Box(boxNode);
  if (box.type !== data.type) {
    box.type = data.type;
  }
  if (data.value) {
    box.value = data.value;
    box.render();
  }
}
