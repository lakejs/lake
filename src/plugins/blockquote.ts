import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('blockquote', () => {
    editor.focus();
    editor.selection.setBlocks('<blockquote />');
    editor.history.save();
    editor.select();
  });
};
