import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('fontfamily', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="font-family: ${value};" />`);
    editor.select();
  });
};
