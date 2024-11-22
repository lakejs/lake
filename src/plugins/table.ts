import { type Editor } from '..';
import { ToolbarItem } from '../types/toolbar';
import { DropdownMenuItem } from '../types/dropdown';
import { icons } from '../icons';
import { debug } from '../utils/debug';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertBlock } from '../operations/insert-block';
import { FloatingToolbar } from '../ui/floating-toolbar';

type TableRowMap = Map<number, HTMLTableCellElement>;

type TableMap = Map<number, TableRowMap>;

type HorizontalDirection = 'left' | 'right';

type VerticalDirection = 'up' | 'down';

type ActionDirection = HorizontalDirection | VerticalDirection;

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


// Returns the number of columns in the specified table, treating merged cells as if they were split.
function getColumnCount(table: HTMLTableElement): number {
  const row = table.rows[0];
  let columnCount = 0;
  for (let i = 0; i < row.cells.length; i++) {
    const cell = row.cells[i];
    columnCount += cell.colSpan;
  }
  return columnCount;
}

// Returns a map of the specified table, treating merged cells as if they were split.
export function getTableMap(table: HTMLTableElement): TableMap {
  const tableMap: TableMap = new Map();
  for (let i = 0; i < table.rows.length; i++) {
    tableMap.set(i, new Map());
  }
  for (const [rowIndex, rowMap] of tableMap) {
    const row = table.rows[rowIndex];
    let newCellIndex = 0;
    for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      newCellIndex = cellIndex;
      while (rowMap.has(newCellIndex)) {
        newCellIndex++;
      }
      const cell = row.cells[cellIndex];
      for (let i = 0; i < cell.colSpan; i++) {
        for (let j = 0; j < cell.rowSpan; j++) {
          const targetRowMap = tableMap.get(rowIndex + j);
          if (targetRowMap) {
            targetRowMap.set(newCellIndex + i, cell);
          }
        }
      }
    }
  }
  return tableMap;
}

// Returns the index of a cell, treating merged cells as if they were split.
function getAbsoluteCellIndex(table: HTMLTableElement, currentRow: HTMLTableRowElement, currentCell: HTMLTableCellElement): number {
  const columnCount = getColumnCount(table);
  let rowSpan = 0;
  let colSpan = 0;
  for (let i = 0; i < columnCount; i++) {
    const cell = currentRow.cells[i];
    if (!cell) {
      break;
    }
    for (let j = currentRow.rowIndex - 1; j >= 0; j--) {
      const aboveCell = table.rows[j].cells[i];
      if (aboveCell && aboveCell.rowSpan > currentRow.rowIndex - j) {
        rowSpan += aboveCell.colSpan;
      }
    }
    if (cell === currentCell) {
      break;
    }
    colSpan += cell.colSpan - 1;
  }
  return currentCell.cellIndex + rowSpan + colSpan;
}

// Returns the index of a cell by an absolute index that treats merged cells as if they were split.
function getActualCellIndex(table: HTMLTableElement, currentRow: HTMLTableRowElement, cellIndex: number): number {
  let rowSpan = 0;
  let colSpan = 0;
  for (let i = 0; i < cellIndex; i++) {
    const cell = currentRow.cells[i];
    if (!cell) {
      break;
    }
    for (let j = currentRow.rowIndex - 1; j >= 0; j--) {
      const aboveCell = table.rows[j].cells[i];
      if (aboveCell && aboveCell.rowSpan > currentRow.rowIndex - j) {
        rowSpan += aboveCell.colSpan;
      }
    }
    colSpan += cell.colSpan - 1;
  }
  const index = cellIndex - rowSpan - colSpan;
  return index > 0 ? index : 0;
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
export function insertColumn(range: Range, direction: HorizontalDirection): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const columnCount = getColumnCount(table);
  const targetCell = direction === 'left' ? currentCell : currentRow.cells[currentCell.cellIndex + 1];
  const absoluteCellIndex = targetCell ? getAbsoluteCellIndex(table, currentRow, targetCell) : columnCount;
  debug(`insertColumn: rows ${table.rows.length}, columns ${columnCount}, absolute cell ${absoluteCellIndex}`);
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cellCount = row.cells.length;
    const cellIndex = getActualCellIndex(table, row, absoluteCellIndex);
    const cell = row.cells[cellIndex];
    debug(`insertColumn: row ${i}, cell ${cellIndex}`);
    if (cell && cell.colSpan > 1) {
      cell.colSpan += 1;
      if (cell.rowSpan > 1) {
        i += cell.rowSpan - 1;
      }
    } else {
      const newCell = row.insertCell(cellIndex < cellCount ? cellIndex : cellCount);
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
  const absoluteCellIndex = getAbsoluteCellIndex(table, currentRow, currentCell);
  let newTargetCell: HTMLTableCellElement | null = null;
  const actualIndex = currentCell.cellIndex;
  if (currentRow.cells[actualIndex + 1]) {
    newTargetCell = currentRow.cells[actualIndex + 1];
  } else if (currentRow.cells[actualIndex - 1]) {
    newTargetCell = currentRow.cells[actualIndex - 1];
  }
  debug(`deleteColumn: rows ${table.rows.length}, absolute cell ${absoluteCellIndex}`);
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cellIndex = getActualCellIndex(table, row, absoluteCellIndex);
    const cell = row.cells[cellIndex];
    debug(`deleteColumn: row ${i}, cell ${cellIndex}`);
    if (cell && cell.rowSpan > 1) {
      i += cell.rowSpan - 1;
    }
    if (cell && cell.colSpan > 1) {
      cell.colSpan -= 1;
      if (cell.colSpan === 1) {
        query(cell).removeAttr('colSpan');
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
export function insertRow(range: Range, direction: VerticalDirection): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const columnCount = getColumnCount(table);
  let targetRowIndex: number;
  if (direction === 'up') {
    targetRowIndex = currentRow.rowIndex;
  } else {
    targetRowIndex = currentRow.rowIndex + 1;
  }
  const targetRow = table.rows[targetRowIndex];
  debug(`insertRow: rows ${table.rows.length} columns ${columnCount}, target row ${targetRowIndex}`);
  const newRow = table.insertRow(targetRowIndex);
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
    const cellIndex = getActualCellIndex(table, targetRow, i);
    if (cellIndex === savedCellIndex) {
      break;
    }
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
  const absoluteCellIndex = getAbsoluteCellIndex(table, currentRow, currentCell);
  const rowIndex = currentRow.rowIndex;
  debug(`deleteRow: rows ${table.rows.length}, target row ${rowIndex}, absolute cell ${absoluteCellIndex}`);
  for (let i = rowIndex - 1; i >= 0; i--) {
    const cells = table.rows[i].cells;
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell && cell.rowSpan > 1 && cell.rowSpan > rowIndex - i) {
        cell.rowSpan -= 1;
        if (cell.rowSpan === 1) {
          query(cell).removeAttr('rowSpan');
        }
      }
    }
  }
  for (let i = 0; i < currentRow.cells.length; i++) {
    const cell = currentRow.cells[i];
    const absoluteIndex = getAbsoluteCellIndex(table, currentRow, cell);
    if (cell.rowSpan > 1) {
      const belowRow = table.rows[rowIndex + 1];
      if (belowRow) {
        const cellIndex = getActualCellIndex(table, belowRow, absoluteIndex);
        let newCell = belowRow.insertCell(cellIndex);
        const clonedNode = query(cell.cloneNode(true));
        clonedNode.removeAttr('rowSpan');
        query(newCell).replaceWith(clonedNode);
        newCell = clonedNode.get(0) as HTMLTableCellElement;
        if (cell.rowSpan > 1) {
          newCell.rowSpan = cell.rowSpan - 1;
          if (newCell.rowSpan === 1) {
            clonedNode.removeAttr('rowSpan');
          }
        }
      }
    }
  }
  let newTargetCell: HTMLTableCellElement | null = null;
  const newTargetRow = table.rows[rowIndex + 1] || table.rows[rowIndex - 1];
  if (newTargetRow) {
    newTargetCell = newTargetRow.cells[absoluteCellIndex] || newTargetRow.cells[newTargetRow.cells.length - 1];
  }
  table.deleteRow(rowIndex);
  if (newTargetCell) {
    range.shrinkBefore(query(newTargetCell));
  }
  if (table.rows.length === 0) {
    deleteTable(range);
  }
}

// Merges adjacent cells.
export function mergeCells(range: Range, direction: ActionDirection): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const tableMap = getTableMap(table);
  // left and right
  if (direction === 'left' || direction === 'right') {
    const rowIndex = currentRow.rowIndex;
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
    debug(`mergeCells: row ${rowIndex}, cell ${cellIndex}, other row ${rowIndex} other cell ${otherCellIndex}`);
    if (cell.rowSpan !== otherCell.rowSpan) {
      return;
    }
    cell.colSpan += otherCell.colSpan;
    currentRow.deleteCell(otherCellIndex);
    range.shrinkBefore(query(cell));
    return;
  }
  // up and down
  const absoluteIndex = getAbsoluteCellIndex(table, currentRow, currentCell);
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
      const rowMap = tableMap.get(i);
      if (!rowMap) {
        break;
      }
      const aboveCell = rowMap.get(absoluteIndex);
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
      const rowMap = tableMap.get(i);
      if (!rowMap) {
        break;
      }
      const belowCell = rowMap.get(absoluteIndex);
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
  debug(`mergeCells: row ${rowIndex}, cell ${cell.cellIndex}, other row ${otherRowIndex} other cell ${otherCellIndex}`);
  if (cell.colSpan !== otherCell.colSpan) {
    return;
  }
  cell.rowSpan += otherCell.rowSpan;
  otherRow.deleteCell(otherCellIndex);
  range.shrinkBefore(query(cell));
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
      onSelect: (_, value) => {
        const range = editor.selection.range;
        mergeCells(range, value as ActionDirection);
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
      toolbar.updateState({
        activeItems: [],
      });
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
