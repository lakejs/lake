import { type Editor } from '..';
import { SelectionState } from '../types/object';
import { ToolbarItem } from '../types/toolbar';
import { icons } from '../icons';
import { safeTemplate } from '../utils';
import { Nodes } from '../models/nodes';
import { Fragment } from '../models/fragment';
import { FloatingToolbar } from '../ui/floating-toolbar';

function getFloatingToolbarItems(editor: Editor, tableNode: Nodes): ToolbarItem[] {
  const items: ToolbarItem[] = [
    {
      name: 'remove',
      type: 'button',
      icon: icons.get('remove'),
      tooltip: 'Remove table',
      onClick: () => {
        tableNode.remove();
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
  editor.event.on('statechange', (state: SelectionState) => {
    const { appliedItems } = state;
    let tableNode: Nodes | null = null;
    for (const item of appliedItems) {
      if (item.node.name === 'table') {
        tableNode = item.node;
        break;
      }
    }
    if (toolbar) {
      toolbar.unmount();
    }
    if (tableNode) {
      const items = getFloatingToolbarItems(editor, tableNode);
      toolbar = new FloatingToolbar({
        target: tableNode,
        items,
      });
      toolbar.render();
      tableNode = null;
    }
  });
  editor.command.add('table', {
    execute: () => {
      const fragment = new Fragment();
      fragment.append(safeTemplate`
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
      const parts = editor.selection.splitBlock();
      if (parts.start) {
        const range = editor.selection.range;
        range.setEndAfter(parts.start);
        range.collapseToEnd();
      }
      if (parts.end && parts.end.isEmpty) {
        parts.end.remove();
      }
      editor.selection.insertFragment(fragment);
      editor.history.save();
    },
  });
  return () => {
    if (toolbar) {
      toolbar.unmount();
    }
  };
};
