import { type Editor } from '..';
import { ToolbarItem } from '../types/toolbar';
import { DropdownMenuItem } from '../types/dropdown';
import { icons } from '../icons';
import { query } from '../utils/query';
import { template } from '../utils/template';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
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

// Returns the position of the specified cell within its row.
// The first cell has an index of 0.
function getCellIndex(rowNativeNode: HTMLTableRowElement, cellNativeNode: HTMLTableCellElement) {
  let rowSpanCount = 0;
  const cellCount = rowNativeNode.cells.length;
  for (let i = 0; i < cellCount; i++) {
    if (rowNativeNode.cells[i] === cellNativeNode) {
      break;
    }
    rowSpanCount += rowNativeNode.cells[i].rowSpan - 1;
  }
  return cellNativeNode.cellIndex - rowSpanCount;
}

export function deleteTable(range: Range): void {
  const tableNode = range.startNode.closest('table');
  const block = query('<p><br /></p>');
  tableNode.replaceWith(block);
  range.shrinkBefore(block);
}

// Inserts a column to the left or right of the start of the specified range.
export function insertColumn(range: Range, direction: 'left' | 'right' = 'left'): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const tableNativeNode = tableNode.get(0) as HTMLTableElement;
  const rowNativeNode = rowNode.get(0) as HTMLTableRowElement;
  const cellNativeNode = cellNode.get(0) as HTMLTableCellElement;
  let index = cellNativeNode.cellIndex + (direction === 'left' ? 0 : 1);
  // the first row index
  index += tableNativeNode.rows[0].cells.length - rowNativeNode.cells.length;
  for (let i = 0; i < tableNativeNode.rows.length; i++) {
    const row = tableNativeNode.rows[i];
    const cell = row.insertCell(index);
    cell.innerHTML = '<br />';
    index = getCellIndex(row, cell);
  }
}

// Removes the column at the start of the specified range from a table.
export function deleteColumn(range: Range): void {
  const cellNode = range.startNode.closest('td');
  const tableNode = cellNode.closest('table');
  const rowNode = cellNode.closest('tr');
  const tableNativeNode = tableNode.get(0) as HTMLTableElement;
  const rowNativeNode = rowNode.get(0) as HTMLTableRowElement;
  const cellNativeNode = cellNode.get(0) as HTMLTableCellElement;
  const index = cellNativeNode.cellIndex;
  let newTargetCell: HTMLTableCellElement | null = null;
  if (rowNativeNode.cells[index + 1]) {
    newTargetCell = rowNativeNode.cells[index + 1];
  } else if (rowNativeNode.cells[index - 1]) {
    newTargetCell = rowNativeNode.cells[index - 1];
  }
  if (newTargetCell) {
    range.shrinkAfter(query(newTargetCell));
  } else {
    deleteTable(range);
    return;
  }
  for (let i = 0; i < tableNativeNode.rows.length; i++) {
    const row = tableNativeNode.rows[i];
    const cell = row.cells[index];
    if (cell.colSpan > 1) {
      cell.colSpan -= 1;
      if (cell.colSpan === 1) {
        query(cell).removeAttr('colSpan');
      }
    } else {
      row.deleteCell(index);
    }
    if (cell.rowSpan > 1) {
      i += cell.rowSpan - 1;
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
      const tableNode = query(template`
        <table>
          <tr>
            <td><br /></td>
            <td><br /></td>
          </tr>
          <tr>
            <td><br /></td>
            <td><br /></td>
          </tr>
          <tr>
            <td><br /></td>
            <td><br /></td>
          </tr>
        </table>
      `);
      editor.selection.insertBlock(tableNode);
      range.shrinkBefore(tableNode);
      editor.history.save();
    },
  });
  return () => {
    if (toolbar) {
      toolbar.unmount();
    }
  };
};
