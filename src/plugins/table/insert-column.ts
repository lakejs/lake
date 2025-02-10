import { debug } from 'lakelib/utils/debug';
import { Range } from 'lakelib/models/range';
import { getTableMap, getColumnIndex, getCellIndex } from './utils';

type InsertColumnDirection = 'left' | 'right';

// Inserts a column to the left or right of the start of the specified range.
export function insertColumn(range: Range, direction: InsertColumnDirection): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const currentRowIndex = currentRow.rowIndex;
  const tableMap = getTableMap(table);
  // a column should be inserted into columnIndex
  let columnIndex = getColumnIndex(tableMap, currentRowIndex, currentCell);
  if (direction === 'right') {
    const currentRowCells = tableMap[currentRowIndex];
    columnIndex++;
    if (currentRowCells) {
      while (currentCell === currentRowCells[columnIndex]) {
        columnIndex++;
      }
    }
  }
  debug(`insertColumn: rows ${table.rows.length}, column ${columnIndex}, ${direction}`);
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cells = tableMap[i];
    const cellIndex = getCellIndex(tableMap, i, columnIndex);
    const cell = row.cells[cellIndex];
    if (cell && cell.colSpan > 1 && cell === cells[columnIndex - 1]) {
      cell.colSpan += 1;
      if (cell.rowSpan > 1) {
        i += cell.rowSpan - 1;
      }
    } else {
      const newCell = row.insertCell(cellIndex);
      newCell.innerHTML = '<p><br /></p>';
    }
  }
}
