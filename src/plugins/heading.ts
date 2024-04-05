import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('heading', {
    selectedValues: appliedItems => {
      const currentItem = appliedItems.find(item => item.node.isHeading || item.name === 'p');
      return currentItem ? [currentItem.name] : [];
    },
    execute: (type: string) => {
      editor.selection.setBlocks(`<${type} />`);
      editor.history.save();
    },
  });
};
