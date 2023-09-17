import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('highlight', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="background-color: ${value};" />`);
    editor.history.save();
    editor.select();
  });
};
