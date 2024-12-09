import type { Editor } from 'lakelib/editor';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('heading', {
    selectedValues: activeItems => {
      const currentItem = activeItems.find(item => item.node.isHeading || item.name === 'p');
      return currentItem ? [currentItem.name] : [];
    },
    execute: (type: string) => {
      editor.selection.setBlocks(`<${type} />`);
      editor.history.save();
    },
  });
};
