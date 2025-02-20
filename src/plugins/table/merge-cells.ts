import { debug } from '@/utils/debug';
import { query } from '@/utils/query';
import { mergeNodes } from '@/utils/merge-nodes';
import { Range } from '@/models/range';
import { getTableMap, getColumnIndex } from './utils';

export type MergeDirection = 'up' | 'right' | 'down' | 'left';

// Merges adjacent cells.
export function mergeCells(range: Range, direction: MergeDirection): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const currentRowIndex = currentRow.rowIndex;
  const tableMap = getTableMap(table);
  // merge cell left or right
  if (direction === 'left' || direction === 'right') {
    const cellIndex = currentCell.cellIndex;
    let cell: HTMLTableCellElement;
    let otherCellIndex: number;
    let otherCell: HTMLTableCellElement;
    if (direction === 'left') {
      cell = currentRow.cells[cellIndex - 1];
      otherCellIndex = cellIndex;
      otherCell = currentCell;
    } else {
      cell = currentCell;
      otherCellIndex = cellIndex + 1;
      otherCell = currentRow.cells[otherCellIndex];
    }
    if (!cell || !otherCell) {
      return;
    }
    debug(`mergeCells: row ${currentRowIndex}, cell ${cellIndex}, other row ${currentRowIndex}, other cell ${otherCellIndex}`);
    if (cell.rowSpan !== otherCell.rowSpan) {
      return;
    }
    const currentRowCells = tableMap[currentRowIndex];
    const columnIndex = getColumnIndex(tableMap, currentRowIndex, cell);
    const otherColumnIndex = getColumnIndex(tableMap, currentRowIndex, otherCell);
    // check whether the two cells are adjacent
    if (currentRowCells[columnIndex + 1] !== otherCell && currentRowCells[otherColumnIndex - 1] !== cell) {
      return;
    }
    cell.colSpan += otherCell.colSpan;
    mergeNodes(query(cell), query(otherCell));
    range.shrinkBefore(query(cell));
    return;
  }
  // merge cell up or down
  const currentColumnIndex = getColumnIndex(tableMap, currentRowIndex, currentCell);
  let rowIndex: number;
  let cell: HTMLTableCellElement | null;
  let otherRowIndex: number;
  let otherRow: HTMLTableRowElement;
  let otherCellIndex: number;
  let otherCell: HTMLTableCellElement | null;
  if (direction === 'up') {
    rowIndex = -1;
    cell = null;
    for (let i = currentRow.rowIndex - 1; i >= 0; i--) {
      const cells = tableMap[i];
      if (!cells) {
        break;
      }
      const aboveCell = cells[currentColumnIndex];
      if (!aboveCell) {
        break;
      }
      if (cell && aboveCell !== cell) {
        break;
      }
      rowIndex = i;
      cell = aboveCell;
    }
    otherRowIndex = currentRow.rowIndex;
    otherRow = currentRow;
    otherCellIndex = currentCell.cellIndex;
    otherCell = currentCell;
  } else {
    rowIndex = currentRow.rowIndex;
    cell = currentCell;
    otherRowIndex = -1;
    otherCell = null;
    otherCellIndex = -1;
    for (let i = currentRow.rowIndex + 1; i < table.rows.length; i++) {
      const cells = tableMap[i];
      if (!cells) {
        break;
      }
      const belowCell = cells[currentColumnIndex];
      if (!belowCell) {
        break;
      }
      if (belowCell !== otherCell) {
        otherRowIndex = i;
        otherCell = belowCell;
        otherCellIndex = otherCell.cellIndex;
        break;
      }
    }
    otherRow = table.rows[otherRowIndex];
    if (!otherRow) {
      return;
    }
  }
  if (!cell || !otherCell) {
    return;
  }
  debug(`mergeCells: row ${rowIndex}, cell ${cell.cellIndex}, other row ${otherRowIndex}, other cell ${otherCellIndex}`);
  if (cell.colSpan !== otherCell.colSpan) {
    return;
  }
  cell.rowSpan += otherCell.rowSpan;
  mergeNodes(query(cell), query(otherCell));
  range.shrinkBefore(query(cell));
}
