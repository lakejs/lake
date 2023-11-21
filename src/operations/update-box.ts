import { Box } from '../types/box';
import { Range } from '../models/range';

// Update a box at the beginning of the specified range.
export function updateBox(range: Range, box: Box): void {
  const boxNode = range.startNode.closest('lake-box');
  if (boxNode.length === 0) {
    return;
  }
  if (box.value) {
    boxNode.attr('value', btoa(JSON.stringify(box.value)));
    boxNode.find('.box-body').html(box.render(box.value));
  }
}
