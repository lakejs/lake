import { Figure } from '../types/figure';
import { Range } from '../models/range';

// Update a figure at the beginning of the specified range.
export function updateFigure(range: Range, figure: Figure): void {
  const figureNode = range.startNode.closest('figure');
  if (figureNode.length === 0) {
    return;
  }
  if (figure.value) {
    figureNode.attr('value', btoa(JSON.stringify(figure.value)));
    figureNode.find('.figure-body').html(figure.render(figure.value));
  }
}
