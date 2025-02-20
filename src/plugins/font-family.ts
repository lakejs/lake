import type { Editor } from '@/editor';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('fontFamily', {
    selectedValues: activeItems => {
      for (const item of activeItems) {
        if (item.name === 'span') {
          const currentValue = item.node.css('font-family');
          return [currentValue.replace(/['"]/g, '')];
        }
      }
      return [];
    },
    execute: (value: string) => {
      editor.selection.addMark(`<span style="font-family: ${value};" />`);
      editor.history.save();
    },
  });
};
