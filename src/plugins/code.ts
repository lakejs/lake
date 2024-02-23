import type { Editor } from '..';

const tagName = 'code';

export default (editor: Editor) => {
  editor.command.add('code', () => {
    const appliedItems = editor.selection.getAppliedItems();
    if (appliedItems.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
  });
};
