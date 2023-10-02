import type LakeCore from '..';

const tagName = 'sup';

export default (editor: LakeCore) => {
  editor.command.add('superscript', () => {
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
};
