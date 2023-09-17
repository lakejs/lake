import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('fontSize', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="font-size: ${value};" />`);
    editor.history.save();
    editor.select();
  });
};
