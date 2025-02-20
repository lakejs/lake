import { debug } from '@/utils/debug';
import { query } from '@/utils/query';
import { Range } from '@/models/range';
import { getTableMap, getColumnIndex, getCellIndex, isNormalColumn } from './utils';
import { deleteTable } from './delete-table';

// Removes the column containing the start of the specified range from a table.
export function deleteColumn(range: Range): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const currentRowIndex = currentRow.rowIndex;
  const tableMap = getTableMap(table);
  const currentColumnIndex = getColumnIndex(tableMap, currentRowIndex, currentCell);
  let newTargetCell: HTMLTableCellElement | null = null;
  const realIndex = currentCell.cellIndex;
  if (currentRow.cells[realIndex + 1]) {
    newTargetCell = currentRow.cells[realIndex + 1];
  } else if (currentRow.cells[realIndex - 1]) {
    newTargetCell = currentRow.cells[realIndex - 1];
  }
  debug(`deleteColumn: rows ${table.rows.length}, column ${currentColumnIndex}`);
  const isNormal = isNormalColumn(tableMap, currentColumnIndex);
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cellIndex = getCellIndex(tableMap, i, currentColumnIndex);
    const cell = row.cells[cellIndex];
    if (cell.rowSpan > 1) {
      i += cell.rowSpan - 1;
    }
    if (cell.colSpan > 1 && !isNormal) {
      cell.colSpan -= 1;
      if (cell.colSpan === 1) {
        cell.removeAttribute('colSpan');
      }
    } else {
      if (cell === currentCell && newTargetCell) {
        range.shrinkBefore(query(newTargetCell));
      }
      row.deleteCell(cellIndex);
    }
  }
  if (table.rows[0].cells.length === 0) {
    deleteTable(range);
  }
}
