import { debug } from 'lakelib/utils/debug';
import { Range } from 'lakelib/models/range';
import { getTableMap, getCellIndex } from './utils';

type InsertRowDirection = 'up' | 'down';

// Inserts a row above or below the start of the specified range.
export function insertRow(range: Range, direction: InsertRowDirection): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  let tableMap  = getTableMap(table);
  const columnCount = tableMap[0].length;
  let targetRowIndex: number;
  if (direction === 'up') {
    targetRowIndex = currentRow.rowIndex;
  } else {
    targetRowIndex = currentRow.rowIndex + 1;
  }
  const targetRow = table.rows[targetRowIndex];
  debug(`insertRow: rows ${table.rows.length}, target row ${targetRowIndex}`);
  const newRow = table.insertRow(targetRowIndex);
  // last row
  if (!targetRow) {
    for (let i = 0; i < columnCount; i++) {
      const newCell = newRow.insertCell(newRow.cells.length);
      newCell.innerHTML = '<p><br /></p>';
    }
    return;
  }
  tableMap  = getTableMap(table);
  targetRowIndex = targetRow.rowIndex;
  let prevCellIndex: number = -1;
  for (let i = 0; i < columnCount; i++) {
    const cellIndex = getCellIndex(tableMap, targetRowIndex, i);
    if (cellIndex !== prevCellIndex) {
      prevCellIndex = cellIndex;
      const cell = targetRow.cells[cellIndex];
      if (!cell) {
        break;
      }
      const newCell = newRow.insertCell(newRow.cells.length);
      newCell.innerHTML = '<p><br /></p>';
      if (cell.colSpan > 1) {
        newCell.colSpan = cell.colSpan;
        i += cell.colSpan - 1;
      }
    }
  }
  // correct the rowSpan of the affected cells
  for (let i = targetRowIndex - 1; i >= 0; i--) {
    const cells = table.rows[i].cells;
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell.rowSpan > 1 && cell.rowSpan + 1 > targetRowIndex - i) {
        cell.rowSpan += 1;
      }
    }
  }
}
