import type { Editor } from '..';

const tagName = 'strong';

export default (editor: Editor) => {
  editor.command.add('bold', {
    isDisabled: appliedItems => !!appliedItems.find(item => item.node.isHeading),
    isSelected: appliedItems => !!appliedItems.find(item => item.name === tagName),
    execute: () => {
      if (editor.command.isSelected('bold')) {
        editor.selection.removeMark(`<${tagName} />`);
      } else {
        editor.selection.addMark(`<${tagName} />`);
      }
      editor.history.save();
    },
  });
  editor.keystroke.setKeydown('mod+b', event => {
    event.preventDefault();
    editor.command.execute('bold');
  });
};
