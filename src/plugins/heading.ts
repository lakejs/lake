import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('heading', (type: string) => {
    editor.focus();
    editor.selection.setBlocks(`<${type} />`);
    editor.select();
  });
};
