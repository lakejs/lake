import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('list', (type: 'numbered' | 'bulleted' | 'checklist') => {
    editor.focus();
    // TODO
    // const blocks = editor.selection.getBlocks();
    if (type === 'numbered') {
      editor.selection.setBlocks('<li />');
    }
    editor.history.save();
    editor.select();
  });
};
