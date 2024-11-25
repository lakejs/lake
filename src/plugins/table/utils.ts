type TableMap = HTMLTableCellElement[][];

// Returns a virtual map of the specified table, treating merged cells as if they were split.
export function getTableMap(table: HTMLTableElement): TableMap {
  const tableMap: TableMap = [];
  for (let i = 0; i < table.rows.length; i++) {
    tableMap[i] = [];
  }
  for (let rowIndex = 0; rowIndex < tableMap.length; rowIndex++) {
    const row = table.rows[rowIndex];
    const cells = tableMap[rowIndex];
    let newCellIndex = 0;
    for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      newCellIndex = cellIndex;
      while (cells[newCellIndex]) {
        newCellIndex++;
      }
      const cell = row.cells[cellIndex];
      for (let i = 0; i < cell.colSpan; i++) {
        for (let j = 0; j < cell.rowSpan; j++) {
          const targetRowCells = tableMap[rowIndex + j];
          if (targetRowCells) {
            targetRowCells[newCellIndex + i] = cell;
          }
        }
      }
    }
  }
  return tableMap;
}

// Returns the virtual index of a cell, treating merged cells as if they were split.
export function getColumnIndex(tableMap: TableMap, rowIndex: number, currentCell: HTMLTableCellElement): number {
  const currentRowCells = tableMap[rowIndex];
  for (let cellIndex = 0; cellIndex < currentRowCells.length; cellIndex++) {
    const cell = currentRowCells[cellIndex];
    if (cell === currentCell) {
      return cellIndex;
    }
  }
  return -1;
}

// Returns the real index of a cell by an column index that treats merged cells as if they were split.
//
// Example:
//
// Table map:
// a1 b1 b1 d1 e1 f1
// a2 b1 b1 d2 e2 f2
// a3 b1 b1 d3 e2 f3
//
// Result:
// b1: vertual index is 1, real index is 1
// f1: vertual index is 5, real index is 4
// f2: vertual index is 5, real index is 3
// f3: vertual index is 5, real index is 2
export function getCellIndex(tableMap: TableMap, rowIndex: number, columnIndex: number): number {
  const currentRowCells = tableMap[rowIndex];
  const aboveRowCells = tableMap[rowIndex - 1];
  let cellIndex = columnIndex;
  for (let i = 0; i < columnIndex; i++) {
    const cell = currentRowCells[i];
    const nextCell = currentRowCells[i + 1];
    if (cell === nextCell) {
      cellIndex--;
    } else if (aboveRowCells) {
      const aboveCell = aboveRowCells[i];
      if (cell === aboveCell) {
        cellIndex--;
      }
    }
  }
  return cellIndex;
}

// Returns a boolean value indicating whether the column contains a cell merged with adjacent cell.
export function isNormalColumn(tableMap: TableMap, columnIndex: number): boolean {
  for (let i = 0; i < tableMap.length; i++) {
    const cells = tableMap[i];
    const cell = cells[columnIndex];
    const belowRowCells = tableMap[i + 1];
    if (belowRowCells && cell.colSpan !== belowRowCells[columnIndex].colSpan) {
      return false;
    }
  }
  return true;
}
