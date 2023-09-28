import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.command.add('fontColor', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="color: ${value};" />`);
    editor.history.save();
    editor.select();
  });
};
