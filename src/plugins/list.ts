import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('list', (type: 'numbered' | 'bulleted' | 'checklist') => {
    editor.focus();
    if (type === 'numbered') {
      editor.selection.setBlocks('<ol><li></li></ol>');
    }
    editor.history.save();
    editor.select();
  });
};
