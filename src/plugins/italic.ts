import type LakeCore from '../main';

const tagName = 'i';

export default (editor: LakeCore) => {
  editor.commands.add('italic', () => {
    editor.focus();
    const appliedTags = editor.selection.getTags();
    if (appliedTags.find(item => item.name === tagName)) {
      editor.selection.removeMark(`<${tagName} />`);
    } else {
      editor.selection.addMark(`<${tagName} />`);
    }
    editor.history.save();
    editor.select();
  });
  editor.keystroke.setKeydown('$mod+KeyI', event => {
    event.preventDefault();
    editor.commands.execute('italic');
  });
};
