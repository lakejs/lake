import { Figure } from '../types/figure';
import { query } from '../utils';
import { Range } from '../models/range';
import { insertFragment } from './insert-fragment';
import { splitBlock } from './split-block';

function createFigureFragment(figure: Figure): DocumentFragment {
  const html = `
    <figure type="${figure.type}" name="${figure.name}">
      <span class="figure-strip"><br /></span>
      <div class="figure-body" contenteditable="false">${figure.render(figure.value)}</div>
      <span class="figure-strip"><br /></span>
    </figure>
  `;
  const figureNode = query(html.trim());
  if (figure.value) {
    figureNode.attr('value', btoa(JSON.stringify(figure.value)));
  }
  const fragment = document.createDocumentFragment();
  fragment.appendChild(figureNode.get(0));
  return fragment;
}

// Inserts a figure into the specified range.
export function insertFigure(range: Range, figure: Figure): void {
  const fragment = createFigureFragment(figure);
  if (figure.type === 'inline') {
    insertFragment(range, fragment);
    return;
  }
  const parts = splitBlock(range);
  if (parts.left) {
    range.setEndAfter(parts.left);
    range.collapseToEnd();
  }
  if (parts.right && parts.right.isEmpty) {
    parts.right.remove();
  }
  insertFragment(range, fragment);
  if (parts.left && parts.left.isEmpty) {
    parts.left.remove();
  }
}
