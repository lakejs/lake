import type { Editor } from '@/editor';

const tagName = 'code';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  editor.command.add('code', {
    isSelected: activeItems => !!activeItems.find(item => item.name === tagName),
    execute: () => {
      if (editor.command.isSelected('code')) {
        editor.selection.removeMark(`<${tagName} />`);
      } else {
        editor.selection.addMark(`<${tagName} />`);
      }
      editor.history.save();
    },
  });
};
