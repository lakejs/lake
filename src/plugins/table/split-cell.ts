import { debug } from 'lakelib/utils/debug';
import { Range } from 'lakelib/models/range';
import { getTableMap, getColumnIndex, getCellIndex } from './utils';

export type SplitDirection = 'vertical' | 'horizontal';

// Splits a cell that contains the start of the specified range from a table.
export function splitCell(range: Range, direction: SplitDirection): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const currentRowIndex = currentRow.rowIndex;
  const originalRowSpan = currentCell.rowSpan;
  const originalColSpan = currentCell.colSpan;
  let tableMap = getTableMap(table);
  const currentColumnIndex = getColumnIndex(tableMap, currentRowIndex, currentCell);
  debug(`splitCell: row ${currentRowIndex}, cell ${currentColumnIndex}, ${direction}`);
  // split cell horizontally
  if (direction === 'horizontal') {
    const currentRowCells = tableMap[currentRowIndex];
    for (let i = 0; i < currentRowCells.length; i++) {
      const cell = currentRowCells[i];
      if (cell === currentCell) {
        // insert a cell after current cell
        const targetRow = originalRowSpan > 1 ? table.rows[currentRowIndex + 1] : table.insertRow(currentRowIndex + 1);
        const cellIndex = getCellIndex(tableMap, currentRowIndex + 1, currentColumnIndex);
        const newCell = targetRow.insertCell(cellIndex);
        newCell.innerHTML = '<br />';
        // copy colSpan and rowSpan from current cell
        if (currentCell.colSpan > 1) {
          newCell.colSpan = currentCell.colSpan;
        }
        if (currentCell.rowSpan > 2) {
          newCell.rowSpan = currentCell.rowSpan - 1;
        }
        currentCell.removeAttribute('rowSpan');
        tableMap = getTableMap(table);
      } else if (originalRowSpan === 1) {
        // correct the rowSpan of the affected cells
        for (let j = currentRowIndex; j >= 0; j--) {
          const aboveCellList = tableMap[j];
          if (j === 0 || cell !== aboveCellList[i]) {
            cell.rowSpan += 1;
            break;
          }
        }
        tableMap = getTableMap(table);
      }
      if (cell.colSpan > 1) {
        i += cell.colSpan - 1;
      }
    }
    return;
  }
  // split cell vertically
  for (let i = 0; i < tableMap.length; i++) {
    const row = table.rows[i];
    const cells = tableMap[i];
    const cell = cells[currentColumnIndex];
    if (cell === currentCell) {
      const aboveCellList = tableMap[i - 1];
      if (!aboveCellList || cell !== aboveCellList[currentColumnIndex]) {
        const cellIndex = getCellIndex(tableMap, i, currentColumnIndex);
        const newCell = row.insertCell(cellIndex + 1);
        newCell.innerHTML = '<br />';
        if (cell.rowSpan > 1) {
          newCell.rowSpan = cell.rowSpan;
        }
        if (cell.colSpan > 2) {
          newCell.colSpan = cell.colSpan - 1;
        }
        cell.removeAttribute('colSpan');
      }
    } else {
      for (let j = currentColumnIndex; j >= 0; j--) {
        if (j === 0 || cell !== cells[j]) {
          if (originalColSpan === 1) {
            cell.colSpan += 1;
          }
          break;
        }
      }
    }
  }
}
