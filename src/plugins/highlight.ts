import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('highlight', (value: string) => {
    editor.focus();
    editor.selection.addMark(`<span style="background-color: ${value};" />`);
    editor.history.save();
    editor.select();
  });
};
