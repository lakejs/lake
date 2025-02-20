import type { Editor } from '@/editor';

const tagName = 'sub';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('subscript', {
    isSelected: activeItems => !!activeItems.find(item => item.name === tagName),
    execute: () => {
      if (editor.command.isSelected('subscript')) {
        editor.selection.removeMark(`<${tagName} />`);
      } else {
        editor.selection.addMark(`<${tagName} />`);
      }
      editor.history.save();
    },
  });
};
