import type LakeCore from '..';

export default (editor: LakeCore) => {
  editor.command.add('list', (type: 'numbered' | 'bulleted' | 'checklist') => {
    editor.focus();
    const blocks = editor.selection.getBlocks();
    let isList =  false;
    let isNumberedList = false;
    let isBulletedList = false;
    for (const block of blocks) {
      if (!isList && block.isList) {
        isList = true;
      }
      if (!isNumberedList && block.name === 'ol') {
        isNumberedList = true;
      }
      if (!isBulletedList && block.name === 'ul') {
        isBulletedList = true;
      }
    }
    if (isList) {
      if (isNumberedList) {
        if (type === 'numbered') {
          editor.selection.setBlocks('<p />');
        }
        if (type === 'bulleted') {
          editor.selection.setBlocks('<ul><li></li></ul>');
        }
      }
      if (isBulletedList) {
        if (type === 'numbered') {
          editor.selection.setBlocks('<ol><li></li></ol>');
        }
        if (type === 'bulleted') {
          editor.selection.setBlocks('<p />');
        }
      }
    } else {
      if (type === 'numbered') {
        editor.selection.setBlocks('<ol><li></li></ol>');
      }
      if (type === 'bulleted') {
        editor.selection.setBlocks('<ul><li></li></ul>');
      }
    }
    editor.history.save();
    editor.select();
  });
};
