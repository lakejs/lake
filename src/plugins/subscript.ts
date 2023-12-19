import type Editor from '..';

const tagName = 'sub';

export default (editor: Editor) => {
  editor.command.add('subscript', () => {
    const appliedNodes = editor.selection.getAppliedNodes();
    if (appliedNodes.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
  });
};
