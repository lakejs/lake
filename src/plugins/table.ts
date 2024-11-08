import { type Editor } from '..';
import { SelectionState } from '../types/object';
import { ToolbarItem } from '../types/toolbar';
import { icons } from '../icons';
import { Nodes } from '../models/nodes';
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
  return () => {
    if (toolbar) {
      toolbar.unmount();
    }
  };
};
