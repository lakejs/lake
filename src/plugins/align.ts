import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('align', {
    selectedValues: appliedItems => {
      let currentValue = '';
      for (const item of appliedItems) {
        if (item.node.isBlock) {
          currentValue = item.node.computedCSS('text-align');
          break;
        }
      }
      return [currentValue];
    },
    execute: (type: 'left' | 'center' | 'right' | 'justify') => {
      editor.selection.setBlocks({
        'text-align': type,
      });
      editor.history.save();
    },
  });
};
