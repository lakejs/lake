import './table.css';
import { ToolbarItem } from 'lakelib/types/toolbar';
import { DropdownMenuItem } from 'lakelib/types/dropdown';
import { icons } from 'lakelib/icons';
import { colorMenuItems } from 'lakelib/config/menu-items';
import { Nodes } from 'lakelib/models/nodes';
import { FloatingToolbar } from 'lakelib/ui/floating-toolbar';
import { Editor } from 'lakelib/editor';
import { insertTable } from './insert-table';
import { deleteTable } from './delete-table';
import { insertColumn } from './insert-column';
import { deleteColumn } from './delete-column';
import { insertRow } from './insert-row';
import { deleteRow } from './delete-row';
import { mergeCells, MergeDirection } from './merge-cells';
import { splitCell, SplitDirection } from './split-cell';

const columnMenuItems: DropdownMenuItem[] = [
  {
    value: 'insertLeft',
    text: locale => locale.table.insertColumnLeft(),
  },
  {
    value: 'insertRight',
    text: locale => locale.table.insertColumnRight(),
  },
  {
    value: 'delete',
    text: locale => locale.table.deleteColumn(),
  },
];

const rowMenuItems: DropdownMenuItem[] = [
  {
    value: 'insertAbove',
    text: locale => locale.table.insertRowAbove(),
  },
  {
    value: 'insertBelow',
    text: locale => locale.table.insertRowBelow(),
  },
  {
    value: 'delete',
    text: locale => locale.table.deleteRow(),
  },
];

const mergeMenuItems: DropdownMenuItem[] = [
  {
    value: 'up',
    text: locale => locale.table.mergeUp(),
  },
  {
    value: 'right',
    text: locale => locale.table.mergeRight(),
  },
  {
    value: 'down',
    text: locale => locale.table.mergeDown(),
  },
  {
    value: 'left',
    text: locale => locale.table.mergeLeft(),
  },
];

const splitMenuItems: DropdownMenuItem[] = [
  {
    value: 'leftRight',
    text: locale => locale.table.splitLeftRight(),
  },
  {
    value: 'topBottom',
    text: locale => locale.table.splitTopBottom(),
  },
];

function getFloatingToolbarItems(editor: Editor, tableNode: Nodes): ToolbarItem[] {
  const items: ToolbarItem[] = [
    {
      name: 'expand',
      type: 'button',
      icon: icons.get('expand'),
      tooltip: locale => locale.table.fitTable(),
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
      name: 'backgroundColor',
      type: 'dropdown',
      downIcon: icons.get('down'),
      icon: icons.get('backgroundColor'),
      accentIcon: icons.get('backgroundColorAccent'),
      defaultValue: '',
      tooltip: 'Background',
      menuType: 'color',
      menuItems: colorMenuItems,
      menuWidth: '296px',
      onSelect: (_, value) => {
        const range = editor.selection.range;
        const cellNode = range.startNode.closest('td');
        cellNode.css('background-color', value);
        editor.history.save();
      },
    },
    {
      name: 'tableColumn',
      type: 'dropdown',
      downIcon: icons.get('down'),
      icon: icons.get('tableColumn'),
      tooltip: locale => locale.table.column(),
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
      tooltip: locale => locale.table.row(),
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
      tooltip: locale => locale.table.merge(),
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
      tooltip: locale => locale.table.split(),
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
      tooltip: locale => locale.table.remove(),
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
    editor.container.find('table').removeClass('lake-table-focused');
    editor.container.find('td').removeClass('lake-td-focused');
    if (toolbar) {
      toolbar.updateState();
    }
    const range = editor.selection.range;
    const cellNode = range.commonAncestor.closest('td');
    const tableNode = cellNode.closest('table');
    if (savedTableNode && savedTableNode.get(0) === tableNode.get(0)) {
      tableNode.addClass('lake-table-focused');
      cellNode.addClass('lake-td-focused');
      return;
    }
    savedTableNode = tableNode;
    if (toolbar) {
      toolbar.unmount();
    }
    if (tableNode.length > 0) {
      tableNode.addClass('lake-table-focused');
      cellNode.addClass('lake-td-focused');
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
