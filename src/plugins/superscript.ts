import type Editor from '..';

const tagName = 'sup';

export default (editor: Editor) => {
  editor.command.add('superscript', () => {
    editor.focus();
    const appliedNodes = editor.selection.getAppliedNodes();
    if (appliedNodes.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
    editor.select();
  });
};
