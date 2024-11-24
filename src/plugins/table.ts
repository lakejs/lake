import { type Editor } from '..';
import { ToolbarItem } from '../types/toolbar';
import { DropdownMenuItem } from '../types/dropdown';
import { icons } from '../icons';
import { debug } from '../utils/debug';
import { query } from '../utils/query';
import { mergeNodes } from '../utils/merge-nodes';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertBlock } from '../operations/insert-block';
import { FloatingToolbar } from '../ui/floating-toolbar';

type TableMap = HTMLTableCellElement[][];

type InsertColumnDirection = 'left' | 'right';

type InsertRowDirection = 'up' | 'down';

type MergeDirection = 'up' | 'right' | 'down' | 'left';

type SplitDirection = 'vertical' | 'horizontal';

const columnMenuItems: DropdownMenuItem[] = [
  {
    value: 'insertLeft',
    text: 'Insert column left',
  },
  {
    value: 'insertRight',
    text: 'Insert column right',
  },
  {
    value: 'delete',
    text: 'Delete column',
  },
];

const rowMenuItems: DropdownMenuItem[] = [
  {
    value: 'insertAbove',
    text: 'Insert row above',
  },
  {
    value: 'insertBelow',
    text: 'Insert row below',
  },
  {
    value: 'delete',
    text: 'Delete row',
  },
];

const mergeMenuItems: DropdownMenuItem[] = [
  {
    value: 'up',
    text: 'Merge cell up',
  },
  {
    value: 'right',
    text: 'Merge cell right',
  },
  {
    value: 'down',
    text: 'Merge cell down',
  },
  {
    value: 'left',
    text: 'Merge cell left',
  },
];

const splitMenuItems: DropdownMenuItem[] = [
  {
    value: 'vertical',
    text: 'Split cell vertically',
  },
  {
    value: 'horizontal',
    text: 'Split cell horizontally',
  },
];

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
            // console.log(rowIndex + j, newCellIndex + i, cell.innerText);
            targetRowCells[newCellIndex + i] = cell;
          }
        }
      }
    }
  }
  return tableMap;
}

// Returns the virtual index of a cell, treating merged cells as if they were split.
function getVirtualCellIndex(tableMap: TableMap, rowIndex: number, currentCell: HTMLTableCellElement): number {
  const currentRowCells = tableMap[rowIndex];
  for (let cellIndex = 0; cellIndex < currentRowCells.length; cellIndex++) {
    const cell = currentRowCells[cellIndex];
    if (cell === currentCell) {
      return cellIndex;
    }
  }
  return -1;
}

// Returns the real index of a cell by an virtual index that treats merged cells as if they were split.
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
function getRealCellIndex(tableMap: TableMap, rowIndex: number, virtualCellIndex: number): number {
  const currentRowCells = tableMap[rowIndex];
  const aboveRowCells = tableMap[rowIndex - 1];
  let cellIndex = virtualCellIndex;
  for (let i = 0; i < virtualCellIndex; i++) {
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

// Inserts a table.
export function insertTable(range: Range, rows: number, columns: number): Nodes {
  let html = '<table>';
  for (let i = 0; i < rows; i++) {
    html += '<tr>';
    for (let j = 0; j < columns; j++) {
      html += '<td><br /></td>';
    }
    html += '</tr>';
  }
  html += '</table>';
  const tableNode = query(html);
  insertBlock(range, tableNode);
  range.shrinkBefore(tableNode);
  debug(`insertTable: table ${tableNode.id}`);
  return tableNode;
}

// Removes a table.
export function deleteTable(range: Range): void {
  const tableNode = range.startNode.closest('table');
  const block = query('<p><br /></p>');
  tableNode.replaceWith(block);
  range.shrinkBefore(block);
  debug(`deleteTable: table ${tableNode.id}`);
}

// Inserts a column to the left or right of the start of the specified range.
export function insertColumn(range: Range, direction: InsertColumnDirection): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const currentRowIndex = currentRow.rowIndex;
  const tableMap  = getTableMap(table);
  // a column should be inserted into virtualCellIndex
  let virtualCellIndex = getVirtualCellIndex(tableMap, currentRowIndex, currentCell);
  if (direction === 'right') {
    const currentRowCells = tableMap[currentRowIndex];
    virtualCellIndex++;
    while (currentRowCells && currentCell === currentRowCells[virtualCellIndex]) {
      virtualCellIndex++;
    }
  }
  debug(`insertColumn: rows ${table.rows.length}, cell index ${virtualCellIndex}, ${direction}`);
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cells = tableMap[i];
    const cellIndex = getRealCellIndex(tableMap, i, virtualCellIndex);
    const cell = row.cells[cellIndex];
    if (cell && cell.colSpan > 1 && cell === cells[virtualCellIndex - 1]) {
      cell.colSpan += 1;
      if (cell.rowSpan > 1) {
        i += cell.rowSpan - 1;
      }
    } else {
      const newCell = row.insertCell(cellIndex);
      newCell.innerHTML = '<br />';
    }
  }
}

// Removes the column containing the start of the specified range from a table.
export function deleteColumn(range: Range): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const currentRowIndex = currentRow.rowIndex;
  const tableMap  = getTableMap(table);
  const virtualCellIndex = getVirtualCellIndex(tableMap, currentRowIndex, currentCell);
  let newTargetCell: HTMLTableCellElement | null = null;
  const realIndex = currentCell.cellIndex;
  if (currentRow.cells[realIndex + 1]) {
    newTargetCell = currentRow.cells[realIndex + 1];
  } else if (currentRow.cells[realIndex - 1]) {
    newTargetCell = currentRow.cells[realIndex - 1];
  }
  debug(`deleteColumn: rows ${table.rows.length}, virtual cell ${virtualCellIndex}`);
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cellIndex = getRealCellIndex(tableMap, i, virtualCellIndex);
    const cell = row.cells[cellIndex];
    debug(`deleteColumn: row ${i}, cell ${cellIndex}`);
    if (cell && cell.rowSpan > 1) {
      i += cell.rowSpan - 1;
    }
    if (cell && cell.colSpan > 1) {
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
  tableMap  = getTableMap(table);
  // last row
  if (!targetRow) {
    for (let i = 0; i < columnCount; i++) {
      const newCell = newRow.insertCell(newRow.cells.length);
      newCell.innerHTML = '<br />';
    }
    return;
  }
  let savedCellIndex: number = -1;
  for (let i = 0; i < columnCount; i++) {
    const cellIndex = getRealCellIndex(tableMap, targetRow.rowIndex, i);
    if (cellIndex !== savedCellIndex) {
      savedCellIndex = cellIndex;
      const cell = targetRow.cells[cellIndex];
      if (!cell) {
        break;
      }
      const newCell = newRow.insertCell(newRow.cells.length);
      newCell.innerHTML = '<br />';
      if (cell.colSpan > 1) {
        newCell.colSpan = cell.colSpan;
        i += cell.colSpan - 1;
      }
    }
  }
  for (let i = targetRowIndex - 1; i >= 0; i--) {
    const cells = table.rows[i].cells;
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell && cell.rowSpan > 1 && cell.rowSpan + 1 > targetRow.rowIndex - i) {
        cell.rowSpan += 1;
      }
    }
  }
}

// Removes the row containing the start of the specified range from a table.
export function deleteRow(range: Range): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const currentRowIndex = currentRow.rowIndex;
  const tableMap  = getTableMap(table);
  const virtualCellIndex = getVirtualCellIndex(tableMap, currentRowIndex, currentCell);
  debug(`deleteRow: rows ${table.rows.length}, target row ${currentRowIndex}, virtual cell ${virtualCellIndex}`);
  for (let i = currentRowIndex - 1; i >= 0; i--) {
    const cells = table.rows[i].cells;
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell && cell.rowSpan > 1 && cell.rowSpan > currentRowIndex - i) {
        cell.rowSpan -= 1;
        if (cell.rowSpan === 1) {
          cell.removeAttribute('rowSpan');
        }
      }
    }
  }
  for (let i = 0; i < currentRow.cells.length; i++) {
    const cell = currentRow.cells[i];
    const virtualIndex = getVirtualCellIndex(tableMap, currentRowIndex, cell);
    if (cell.rowSpan > 1) {
      const belowRow = table.rows[currentRowIndex + 1];
      if (belowRow) {
        const cellIndex = getRealCellIndex(tableMap, currentRowIndex + 1, virtualIndex);
        let newCell = belowRow.insertCell(cellIndex);
        const clonedCell = cell.cloneNode(true) as HTMLTableCellElement;
        clonedCell.removeAttribute('rowSpan');
        newCell.replaceWith(clonedCell);
        newCell = clonedCell;
        if (cell.rowSpan > 1) {
          newCell.rowSpan = cell.rowSpan - 1;
          if (newCell.rowSpan === 1) {
            newCell.removeAttribute('rowSpan');
          }
        }
      }
    }
  }
  let newTargetCell: HTMLTableCellElement | null = null;
  const newTargetRow = table.rows[currentRowIndex + 1] || table.rows[currentRowIndex - 1];
  if (newTargetRow) {
    newTargetCell = newTargetRow.cells[virtualCellIndex] || newTargetRow.cells[newTargetRow.cells.length - 1];
  }
  table.deleteRow(currentRowIndex);
  if (newTargetCell) {
    range.shrinkBefore(query(newTargetCell));
  }
  if (table.rows.length === 0) {
    deleteTable(range);
  }
}

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
  // Merge cell left or right.
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
    const virtualCellIndex = getVirtualCellIndex(tableMap, currentRowIndex, cell);
    const virtualOtherCellIndex = getVirtualCellIndex(tableMap, currentRowIndex, otherCell);
    // check whether the two cells are adjacent
    if (currentRowCells[virtualCellIndex + 1] !== otherCell && currentRowCells[virtualOtherCellIndex - 1] !== cell) {
      return;
    }
    cell.colSpan += otherCell.colSpan;
    mergeNodes(query(cell), query(otherCell));
    range.shrinkBefore(query(cell));
    return;
  }
  // Merge cell up or down.
  const virtualIndex = getVirtualCellIndex(tableMap, currentRowIndex, currentCell);
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
      const aboveCell = cells[virtualIndex];
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
      const belowCell = cells[virtualIndex];
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
  const virtualCellIndex = getVirtualCellIndex(tableMap, currentRowIndex, currentCell);
  debug(`splitCell: row ${currentRowIndex}, cell ${virtualCellIndex}, ${direction}`);
  // split cell horizontally
  if (direction === 'horizontal') {
    const currentRowCells = tableMap[currentRowIndex];
    for (let i = 0; i < currentRowCells.length; i++) {
      const cell = currentRowCells[i];
      if (cell === currentCell) {
        // insert a cell after current cell
        const targetRow = originalRowSpan > 1 ? table.rows[currentRowIndex + 1] : table.insertRow(currentRowIndex + 1);
        const cellIndex = getRealCellIndex(tableMap, currentRowIndex + 1, virtualCellIndex);
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
      i += cell.colSpan - 1;
    }
    return;
  }
  // split cell vertically
  for (let i = 0; i < tableMap.length; i++) {
    const row = table.rows[i];
    const cells = tableMap[i];
    const cell = cells[virtualCellIndex];
    if (cell === currentCell) {
      const aboveCellList = tableMap[i - 1];
      if (!aboveCellList || cell !== aboveCellList[virtualCellIndex]) {
        const cellIndex = getRealCellIndex(tableMap, i, virtualCellIndex);
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
      for (let j = virtualCellIndex; j >= 0; j--) {
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

function getFloatingToolbarItems(editor: Editor, tableNode: Nodes): ToolbarItem[] {
  const items: ToolbarItem[] = [
    {
      name: 'expand',
      type: 'button',
      icon: icons.get('expand'),
      tooltip: 'Fit table to page width',
      isSelected: () => {
        const width = tableNode.css('width');
        const pageWidth = `${editor.container.innerWidth() - 2}px`;
        return width === pageWidth;
      },
      onClick: () => {
        const width = tableNode.css('width');
        const pageWidth = `${editor.container.innerWidth() - 2}px`;
        if (width === pageWidth) {
          tableNode.css('width', '');
        } else {
          tableNode.css('width', pageWidth);
        }
        editor.history.save();
      },
    },
    {
      name: 'tableColumn',
      type: 'dropdown',
      downIcon: icons.get('down'),
      icon: icons.get('tableColumn'),
      tooltip: 'Column',
      menuType: 'list',
      menuItems: columnMenuItems,
      menuCheck: false,
      onSelect: (_, value) => {
        const range = editor.selection.range;
        if (value === 'insertLeft') {
          insertColumn(range, 'left');
        } else if (value === 'insertRight') {
          insertColumn(range, 'right');
        } else {
          deleteColumn(range);
        }
        editor.history.save();
      },
    },
    {
      name: 'tableRow',
      type: 'dropdown',
      downIcon: icons.get('down'),
      icon: icons.get('tableRow'),
      tooltip: 'Row',
      menuType: 'list',
      menuItems: rowMenuItems,
      menuCheck: false,
      onSelect: (_, value) => {
        const range = editor.selection.range;
        if (value === 'insertAbove') {
          insertRow(range, 'up');
        } else if (value === 'insertBelow') {
          insertRow(range, 'down');
        } else {
          deleteRow(range);
        }
        editor.history.save();
      },
    },
    {
      name: 'tableMerge',
      type: 'dropdown',
      downIcon: icons.get('down'),
      icon: icons.get('tableMerge'),
      tooltip: 'Merge cells',
      menuType: 'list',
      menuItems: mergeMenuItems,
      menuCheck: false,
      onSelect: (_, value) => {
        const range = editor.selection.range;
        mergeCells(range, value as MergeDirection);
        editor.history.save();
      },
    },
    {
      name: 'tableSplit',
      type: 'dropdown',
      downIcon: icons.get('down'),
      icon: icons.get('tableSplit'),
      tooltip: 'Split cell',
      menuType: 'list',
      menuItems: splitMenuItems,
      menuCheck: false,
      onSelect: (_, value) => {
        const range = editor.selection.range;
        splitCell(range, value as SplitDirection);
        editor.history.save();
      },
    },
    {
      name: 'remove',
      type: 'button',
      icon: icons.get('remove'),
      tooltip: 'Remove table',
      onClick: () => {
        deleteTable(editor.selection.range);
        editor.history.save();
      },
    },
  ];
  return items;
}

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  let toolbar: FloatingToolbar | null = null;
  let savedTableNode: Nodes | null = null;
  editor.event.on('statechange', () => {
    if (toolbar) {
      toolbar.updateState();
    }
    const range = editor.selection.range;
    const tableNode = range.commonAncestor.closest('table');
    if (savedTableNode && savedTableNode.get(0) === tableNode.get(0)) {
      return;
    }
    savedTableNode = tableNode;
    if (toolbar) {
      toolbar.unmount();
    }
    if (tableNode.length > 0) {
      const items = getFloatingToolbarItems(editor, tableNode);
      toolbar = new FloatingToolbar({
        target: tableNode,
        items,
      });
      toolbar.render();
    }
  });
  editor.command.add('table', {
    execute: () => {
      const range = editor.selection.range;
      insertTable(range, 3, 2);
      editor.history.save();
    },
  });
  return () => {
    if (toolbar) {
      toolbar.unmount();
    }
  };
};
