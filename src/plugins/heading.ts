import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('heading', (type: string) => {
    editor.focus();
    editor.selection.setBlocks(`<${type} />`);
    editor.history.save();
    editor.select();
  });
};
