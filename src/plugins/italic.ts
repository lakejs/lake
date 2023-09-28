import type LakeCore from '../main';

const tagName = 'i';

export default (editor: LakeCore) => {
  editor.command.add('italic', () => {
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
  editor.keystroke.setKeydown('mod+i', event => {
    event.preventDefault();
    editor.command.execute('italic');
  });
};
