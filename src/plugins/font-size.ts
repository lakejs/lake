import type { Editor } from '@/editor';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('fontSize', {
    isDisabled: activeItems => !!activeItems.find(item => item.node.isHeading),
    selectedValues: activeItems => {
      for (const item of activeItems) {
        if (item.name === 'span') {
          const currentValue = item.node.css('font-size');
          return [currentValue.replace(/\.\d+/, '')];
        }
      }
      return [];
    },
    execute: (value: string) => {
      editor.selection.addMark(`<span style="font-size: ${value};" />`);
      editor.history.save();
    },
  });
};
