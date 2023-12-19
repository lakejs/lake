import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('heading', (type: string) => {
    editor.selection.setBlocks(`<${type} />`);
    editor.history.save();
  });
};
