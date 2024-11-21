import { type Editor } from '..';
import { ToolbarItem } from '../types/toolbar';
import { DropdownMenuItem } from '../types/dropdown';
import { icons } from '../icons';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { insertBlock } from '../operations/insert-block';
import { FloatingToolbar } from '../ui/floating-toolbar';

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

/*
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
*/

// Returns the number of cells in the specified row, treating merged cells as if they were split.
function getAbsoluteCellCount(table: HTMLTableElement, rowIndex: number): number {
  const row = table.rows[rowIndex];
  let cellCount = 0;
  for (let i = 0; i < row.cells.length; i++) {
    const cell = row.cells[i];
    cellCount += cell.colSpan;
  }
  return cellCount;
}

// Returns the index of a cell, treating merged cells as if they were split.
function getAbsoluteCellIndex(table: HTMLTableElement, currentRow: HTMLTableRowElement, currentCell: HTMLTableCellElement): number {
  const cellCount = getAbsoluteCellCount(table, 0);
  let rowSpan = 0;
  let colSpan = 0;
  for (let i = 0; i < cellCount; i++) {
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
  return tableNode;
}

// Removes a table.
export function deleteTable(range: Range): void {
  const tableNode = range.startNode.closest('table');
  const block = query('<p><br /></p>');
  tableNode.replaceWith(block);
  range.shrinkBefore(block);
}

// Inserts a column to the left or right of the start of the specified range.
export function insertColumn(range: Range, direction: 'left' | 'right'): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  const currentCell = cellNode.get(0) as HTMLTableCellElement;
  const columnCount = getAbsoluteCellCount(table, 0);
  const targetCell = direction === 'left' ? currentCell : currentRow.cells[currentCell.cellIndex + 1];
  const absoluteIndex = targetCell ? getAbsoluteCellIndex(table, currentRow, targetCell) : columnCount;
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cellCount = row.cells.length;
    const cellIndex = getActualCellIndex(table, row, absoluteIndex);
    const cell = row.cells[cellIndex];
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
  const absoluteIndex = getAbsoluteCellIndex(table, currentRow, currentCell);
  let newTargetCell: HTMLTableCellElement | null = null;
  const actualIndex = currentCell.cellIndex;
  if (currentRow.cells[actualIndex + 1]) {
    newTargetCell = currentRow.cells[actualIndex + 1];
  } else if (currentRow.cells[actualIndex - 1]) {
    newTargetCell = currentRow.cells[actualIndex - 1];
  }
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cellIndex = getActualCellIndex(table, row, absoluteIndex);
    const cell = row.cells[cellIndex];
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
        range.shrinkAfter(query(newTargetCell));
      }
      row.deleteCell(cellIndex);
    }
  }
  if (table.rows[0].cells.length === 0) {
    deleteTable(range);
  }
}

// Inserts a row above or below the start of the specified range.
export function insertRow(range: Range, direction: 'above' | 'below'): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const table = tableNode.get(0) as HTMLTableElement;
  const currentRow = rowNode.get(0) as HTMLTableRowElement;
  let targetRowIndex: number;
  if (direction === 'above') {
    targetRowIndex = currentRow.rowIndex;
  } else {
    targetRowIndex = currentRow.rowIndex + 1;
  }
  const rowRef = table.rows[targetRowIndex];
  const columnCount = getAbsoluteCellCount(table, 0);
  const newRow = table.insertRow(targetRowIndex);
  // last row
  if (!rowRef) {
    for (let i = 0; i < columnCount; i++) {
      const newCell = newRow.insertCell(newRow.cells.length);
      newCell.innerHTML = '<br />';
    }
    return;
  }
  let savedActualIndex: number = -1;
  for (let i = 0; i < columnCount; i++) {
    const actualIndex = getActualCellIndex(table, rowRef, i);
    if (actualIndex === savedActualIndex) {
      break;
    }
    savedActualIndex = actualIndex;
    const cell = rowRef.cells[actualIndex];
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
      if (cell && cell.rowSpan > 1 && cell.rowSpan + 1 > rowRef.rowIndex - i) {
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
  const currentIndex = getAbsoluteCellIndex(table, currentRow, currentCell);
  const rowIndex = currentRow.rowIndex;
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
        const index = getActualCellIndex(table, belowRow, absoluteIndex);
        let newCell = belowRow.insertCell(index > 0 ? index : 0);
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
    newTargetCell = newTargetRow.cells[currentIndex] || newTargetRow.cells[newTargetRow.cells.length - 1];
  }
  table.deleteRow(rowIndex);
  if (newTargetCell) {
    range.shrinkAfter(query(newTargetCell));
  }
  if (table.rows.length === 0) {
    deleteTable(range);
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
          insertRow(range, 'above');
        } else if (value === 'insertBelow') {
          insertRow(range, 'below');
        } else {
          deleteRow(range);
        }
        editor.history.save();
      },
    },
    /* {
      name: 'tableMerge',
      type: 'dropdown',
      downIcon: icons.get('down'),
      icon: icons.get('tableMerge'),
      tooltip: 'Merge cells',
      menuType: 'list',
      menuItems: mergeMenuItems,
      onSelect: () => {
        // const range = editor.selection.range;
        // mergeCells(range, value);
        editor.history.save();
      },
    }, */
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
