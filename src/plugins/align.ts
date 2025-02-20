import type { Editor } from '@/editor';

const alignValueMap: Record<string, string> = {
  start: 'left',
  end: 'right',
};

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('align', {
    selectedValues: activeItems => {
      let currentValue;
      for (const item of activeItems) {
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
