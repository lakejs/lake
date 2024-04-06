import type { Editor } from '..';

const alignValueMap: {[key: string]: string} = {
  start: 'left',
  end: 'right',
};

export default (editor: Editor) => {
  editor.command.add('align', {
    selectedValues: appliedItems => {
      let currentValue;
      for (const item of appliedItems) {
        if (item.node.isBlock) {
          currentValue = item.node.computedCSS('text-align');
          break;
        }
      }
      if (!currentValue) {
        return [];
      }
      return [alignValueMap[currentValue] || currentValue];
    },
    execute: (type: 'left' | 'center' | 'right' | 'justify') => {
      editor.selection.setBlocks({
        'text-align': type,
      });
      editor.history.save();
    },
  });
};
