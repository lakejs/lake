import type { Editor } from '..';

export default (editor: Editor) => {
  editor.command.add('fontSize', {
    isDisabled: appliedItems => !!appliedItems.find(item => item.node.isHeading),
    selectedValues: appliedItems => {
      for (const item of appliedItems) {
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
