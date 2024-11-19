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

// Returns the absolute position by the actual cell index.
function getAbsoluteCellIndex(table: HTMLTableElement, targetRow: HTMLTableRowElement, actualIndex: number) {
  let colSpan = 0;
  let rowSpan = 0;
  for (let i = 0; i <= actualIndex; i++) {
    const cell = targetRow.cells[i];
    if (!cell) {
      break;
    }
    colSpan += cell.colSpan - 1;
    for (let j = targetRow.rowIndex - 1; j >= 0; j--) {
      const row = table.rows[j];
      if (row.cells[i].rowSpan > targetRow.rowIndex - j) {
        rowSpan += 1;
      }
    }
  }
  return actualIndex + colSpan + rowSpan;
}

// Returns the actual position by the absolute cell index.
function getActualCellIndex(table: HTMLTableElement, targetRow: HTMLTableRowElement, absoluteIndex: number) {
  let colSpan = 0;
  let rowSpan = 0;
  for (let i = 0; i < absoluteIndex; i++) {
    const cell = targetRow.cells[i];
    if (!cell) {
      break;
    }
    colSpan += cell.colSpan - 1;
    for (let j = targetRow.rowIndex - 1; j >= 0; j--) {
      const row = table.rows[j];
      if (row.cells[i].rowSpan > targetRow.rowIndex - j) {
        rowSpan += 1;
      }
    }
  }
  return absoluteIndex - colSpan - rowSpan;
}

// Inserts a table.
export function insertTable(range: Range, rows: number, cols: number): void {
  let html = '<table>';
  for (let i = 0; i < rows; i++) {
    html += '<tr>';
    for (let j = 0; j < cols; j++) {
      html += '<td><br /></td>';
    }
    html += '</tr>';
  }
  html += '</table>';
  const tableNode = query(html);
  insertBlock(range, tableNode);
  range.shrinkBefore(tableNode);
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
  const tableNativeNode = tableNode.get(0) as HTMLTableElement;
  const rowNativeNode = rowNode.get(0) as HTMLTableRowElement;
  const cellNativeNode = cellNode.get(0) as HTMLTableCellElement;
  const index = direction === 'left' ? cellNativeNode.cellIndex : cellNativeNode.cellIndex + 1;
  const targetCellIndex = getAbsoluteCellIndex(tableNativeNode, rowNativeNode, index);
  for (let i = 0; i < tableNativeNode.rows.length; i++) {
    const row = tableNativeNode.rows[i];
    const cellIndex = getActualCellIndex(tableNativeNode, row, targetCellIndex);
    const cell = row.insertCell(cellIndex);
    cell.innerHTML = '<br />';
  }
}

// Removes the column containing the start of the specified range from a table.
export function deleteColumn(range: Range): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const tableNativeNode = tableNode.get(0) as HTMLTableElement;
  const rowNativeNode = rowNode.get(0) as HTMLTableRowElement;
  const cellNativeNode = cellNode.get(0) as HTMLTableCellElement;
  const cellIndex = cellNativeNode.cellIndex;
  let newTargetCell: HTMLTableCellElement | null = null;
  if (rowNativeNode.cells[cellIndex + 1]) {
    newTargetCell = rowNativeNode.cells[cellIndex + 1];
  } else if (rowNativeNode.cells[cellIndex - 1]) {
    newTargetCell = rowNativeNode.cells[cellIndex - 1];
  }
  if (newTargetCell) {
    range.shrinkAfter(query(newTargetCell));
  } else {
    deleteTable(range);
    return;
  }
  for (let i = 0; i < tableNativeNode.rows.length; i++) {
    const row = tableNativeNode.rows[i];
    const cell = row.cells[cellIndex];
    if (cell.colSpan > 1) {
      cell.colSpan -= 1;
      if (cell.colSpan === 1) {
        query(cell).removeAttr('colSpan');
      }
    } else {
      row.deleteCell(cellIndex);
    }
    if (cell.rowSpan > 1) {
      i += cell.rowSpan - 1;
    }
  }
}

// Inserts a row above or below the start of the specified range.
export function insertRow(range: Range, direction: 'above' | 'below' = 'above'): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const tableNativeNode = tableNode.get(0) as HTMLTableElement;
  const rowNativeNode = rowNode.get(0) as HTMLTableRowElement;
  const cellNativeNode = cellNode.get(0) as HTMLTableCellElement;
  let rowIndex: number;
  if (direction === 'below') {
    rowIndex = rowNativeNode.rowIndex + (cellNativeNode.rowSpan - 1) + 1;
  } else {
    rowIndex = rowNativeNode.rowIndex;
  }
  const newRow = tableNativeNode.insertRow(rowIndex);
  let cellCount = rowNativeNode.cells.length;
  for (let i = 0; i < cellCount; i++) {
    // adjust cells length
    if (rowNativeNode.cells[i].rowSpan > 1) {
      cellCount -= rowNativeNode.cells[i].rowSpan - 1;
    }
    const newCell = newRow.insertCell(i);
    newCell.innerHTML = '<br />';
    // copy colspan
    if (direction === 'below' && rowNativeNode.cells[i].colSpan > 1) {
      newCell.colSpan = rowNativeNode.cells[i].colSpan;
    }
    // adjust rowspan
    for (let j = rowIndex; j >= 0; j--) {
      const cells = tableNativeNode.rows[j].cells;
      if (cells.length > i) {
        for (let k = cellNativeNode.cellIndex; k >= 0; k--) {
          if (cells[k].rowSpan > 1) {
            cells[k].rowSpan += 1;
          }
        }
        break;
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
