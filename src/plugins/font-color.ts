import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('fontColor', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="color: ${value};" />`);
    editor.select();
  });
};
