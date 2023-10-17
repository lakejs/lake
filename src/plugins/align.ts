import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('align', (type: string) => {
    editor.focus();
    editor.selection.setBlocks({
      'text-align': type,
    });
    editor.history.save();
    editor.select();
  });
};
