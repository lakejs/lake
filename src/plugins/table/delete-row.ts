import { debug } from '@/utils/debug';
import { query } from '@/utils/query';
import { Range } from '@/models/range';
import { getTableMap, getColumnIndex, getCellIndex } from './utils';
import { deleteTable } from './delete-table';

// Removes the row containing the start of the specified range from a table.
export function deleteRow(range: Range): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const currentRowIndex = currentRow.rowIndex;
  let tableMap = getTableMap(table);
  const columnCount = tableMap[0].length;
  const currentColumnIndex = getColumnIndex(tableMap, currentRowIndex, currentCell);
  const newTargetRow = table.rows[currentRowIndex + 1] || table.rows[currentRowIndex - 1];
  debug(`deleteRow: rows ${table.rows.length}, target row ${currentRowIndex}, column ${currentColumnIndex}`);
  // correct the rowSpan of the affected cells
  for (let i = currentRowIndex - 1; i >= 0; i--) {
    const cells = table.rows[i].cells;
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell.rowSpan > 1 && cell.rowSpan > currentRowIndex - i) {
        cell.rowSpan -= 1;
        if (cell.rowSpan === 1) {
          cell.removeAttribute('rowSpan');
        }
      }
    }
  }
  const belowRow = table.rows[currentRowIndex + 1];
  if (belowRow) {
    let prevCellIndex = -1;
    for (let i = 0; i < columnCount; i++) {
      const cellIndex = getCellIndex(tableMap, currentRowIndex, i);
      if (cellIndex !== prevCellIndex) {
        prevCellIndex = cellIndex;
        const cell = currentRow.cells[cellIndex];
        if (cell.rowSpan > 1) {
          const belowCellIndex = getCellIndex(tableMap, currentRowIndex + 1, i);
          let newCell = belowRow.insertCell(belowCellIndex);
          const clonedCell = cell.cloneNode(true) as HTMLTableCellElement;
          clonedCell.removeAttribute('rowSpan');
          newCell.replaceWith(clonedCell);
          newCell = clonedCell;
          if (cell.rowSpan > 2) {
            newCell.rowSpan = cell.rowSpan - 1;
          }
        }
      }
    }
  }
  table.deleteRow(currentRowIndex);
  if (newTargetRow) {
    tableMap = getTableMap(table);
    const cellIndex = getCellIndex(tableMap, newTargetRow.rowIndex, currentColumnIndex);
    const newTargetCell = newTargetRow.cells[cellIndex];
    if (newTargetCell) {
      range.shrinkBefore(query(newTargetCell));
    }
  }
  if (table.rows.length === 0) {
    deleteTable(range);
  }
}
