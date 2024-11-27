import './table.css';
import { ToolbarItem } from 'lakelib/types/toolbar';
import { DropdownMenuItem } from 'lakelib/types/dropdown';
import { icons } from 'lakelib/icons';
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
