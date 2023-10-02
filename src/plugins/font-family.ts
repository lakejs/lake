import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('fontFamily', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="font-family: ${value};" />`);
    editor.history.save();
    editor.select();
  });
};
