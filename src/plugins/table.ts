import { type Editor } from '..';
import { ToolbarItem } from '../types/toolbar';
import { icons } from '../icons';
import { query, template } from '../utils';
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
  editor.event.on('statechange', () => {
    const range = editor.selection.range;
    const tableNode = range.commonAncestor.closest('table');
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
      const fragment = new Fragment();
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
      fragment.append(tableNode);
      const parts = editor.selection.splitBlock();
      if (parts.start) {
        range.setEndAfter(parts.start);
        range.collapseToEnd();
      }
      if (parts.end && parts.end.isEmpty) {
        parts.end.remove();
      }
      editor.selection.insertFragment(fragment);
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
