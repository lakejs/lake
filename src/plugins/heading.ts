import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('heading', (type: string) => {
    editor.focus();
    editor.selection.setBlocks(`<${type} />`);
    editor.select();
  });
  editor.keystroke.setKeydown('Shift+Enter', event => {
    event.preventDefault();
    editor.selection.insertContents('<br />&NoBreak;');
  });
  editor.keystroke.setKeydown('Enter', event => {
    event.preventDefault();
    const blockList = editor.selection.getBlocks();
    if (blockList.length > 0) {
      editor.selection.splitBlock();
    } else {
      editor.selection.setBlocks('<p />');
    }
  });
};
