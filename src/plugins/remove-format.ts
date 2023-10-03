import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('removeFormat', () => {
    editor.focus();
    // editor.selection.removeMark();
    editor.history.save();
    editor.select();
  });
};
