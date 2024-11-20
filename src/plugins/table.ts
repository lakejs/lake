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

// Returns the length of the cells of the specified row.
function getCellCount(table: HTMLTableElement, rowIndex: number): number {
  const row = table.rows[rowIndex];
  let columnCount = 0;
  for (let i = 0; i < row.cells.length; i++) {
    const cell = row.cells[i];
    columnCount += cell.colSpan;
  }
  return columnCount;
}

// Returns the absolute position by the actual cell index.
function getAbsoluteCellIndex(table: HTMLTableElement, currentRow: HTMLTableRowElement, actualIndex: number): number {
  let colSpan = 0;
  let rowSpan = 0;
  for (let i = 0; i <= actualIndex; i++) {
    const cell = currentRow.cells[i];
    if (!cell) {
      break;
    }
    colSpan += cell.colSpan - 1;
    for (let j = currentRow.rowIndex - 1; j >= 0; j--) {
      const aboveCell = table.rows[j].cells[i];
      if (aboveCell && aboveCell.rowSpan > currentRow.rowIndex - j) {
        rowSpan += aboveCell.colSpan;
      }
    }
  }
  return actualIndex + colSpan + rowSpan;
}

// Returns the actual position by the absolute cell index.
function getActualCellIndex(table: HTMLTableElement, currentRow: HTMLTableRowElement, absoluteIndex: number): number {
  let colSpan = 0;
  let rowSpan = 0;
  for (let i = 0; i < absoluteIndex; i++) {
    const cell = currentRow.cells[i];
    if (!cell) {
      break;
    }
    colSpan += cell.colSpan - 1;
    for (let j = currentRow.rowIndex - 1; j >= 0; j--) {
      const aboveCell = table.rows[j].cells[i];
      if (aboveCell && aboveCell.rowSpan > currentRow.rowIndex - j) {
        rowSpan += aboveCell.colSpan;
      }
    }
  }
  return absoluteIndex - colSpan - rowSpan;
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
  const targetCellIndex = direction === 'left' ? currentCell.cellIndex : currentCell.cellIndex + 1;
  const absoluteIndex = getAbsoluteCellIndex(table, currentRow, targetCellIndex);
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cellIndex = getActualCellIndex(table, row, absoluteIndex);
    if (cellIndex >= 0) {
      const cell = row.cells[cellIndex];
      if (cell && cell.colSpan > 1) {
        cell.colSpan += 1;
      } else {
        const newCell = row.insertCell(cellIndex);
        newCell.innerHTML = '<br />';
      }
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
  const actualIndex = currentCell.cellIndex;
  const absoluteIndex = getAbsoluteCellIndex(table, currentRow, actualIndex);
  let newTargetCell: HTMLTableCellElement | null = null;
  if (currentRow.cells[actualIndex + 1]) {
    newTargetCell = currentRow.cells[actualIndex + 1];
  } else if (currentRow.cells[actualIndex - 1]) {
    newTargetCell = currentRow.cells[actualIndex - 1];
  }
  const columnCount = getCellCount(table, 0);
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cellIndex = getActualCellIndex(table, row, absoluteIndex);
    if (cellIndex >= 0) {
      const cell = row.cells[cellIndex];
      if (cell && cell.colSpan > 1) {
        cell.colSpan -= 1;
        if (cell.colSpan === 1) {
          query(cell).removeAttr('colSpan');
        }
      } else if (i === 0 || getCellCount(table, i) >= columnCount) {
        if (cell === currentCell && newTargetCell) {
          range.shrinkAfter(query(newTargetCell));
        }
        row.deleteCell(cellIndex);
      }
    }
  }
  if (getCellCount(table, 0) === 0) {
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
  const columnCount = getCellCount(table, 0);
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
  const tableNativeNode = tableNode.get(0) as HTMLTableElement;
  const rowNativeNode = rowNode.get(0) as HTMLTableRowElement;
  const cellNativeNode = cellNode.get(0) as HTMLTableCellElement;
  const rowIndex = rowNativeNode.rowIndex;
  let newTargetCell: HTMLTableCellElement | null = null;
  if (tableNativeNode.rows[rowIndex + 1]) {
    const row = tableNativeNode.rows[rowIndex + 1];
    newTargetCell = row.cells[cellNativeNode.cellIndex];
  } else if (tableNativeNode.rows[rowIndex - 1]) {
    const row = tableNativeNode.rows[rowIndex - 1];
    newTargetCell = row.cells[cellNativeNode.cellIndex];
  }
  if (newTargetCell) {
    range.shrinkAfter(query(newTargetCell));
  } else {
    deleteTable(range);
    return;
  }
  for (let i = cellNativeNode.rowSpan - 1; i >= 0; i--) {
    tableNativeNode.deleteRow(rowIndex + i);
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
