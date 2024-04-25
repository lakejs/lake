import type { Editor } from '..';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('fontFamily', {
    selectedValues: appliedItems => {
      for (const item of appliedItems) {
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
