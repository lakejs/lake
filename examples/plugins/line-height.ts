import type { Editor } from '@/editor';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('lineHeight', {
    isDisabled: activeItems => !!activeItems.find(item => item.node.isHeading),
    selectedValues: activeItems => {
      for (const item of activeItems) {
        if (item.name === 'span') {
          const currentValue = item.node.css('line-height');
          return [currentValue];
        }
      }
      return [];
    },
    execute: value => {
      editor.selection.addMark(`<span style='line-height: ${value};' />`);
      editor.history.save();
    },
  });
};
