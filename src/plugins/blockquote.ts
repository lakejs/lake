import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('blockquote', () => {
    editor.focus();
    editor.selection.setBlocks('<blockquote />');
    editor.history.save();
    editor.select();
  });
};
