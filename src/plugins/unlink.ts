import type Editor from '..';

const tagName = 'a';

export default (editor: Editor) => {
  editor.command.add('unlink', () => {
    const range = editor.selection.range;
    if (range.isCollapsed) {
      const linkNode = range.commonAncestor.closest(tagName);
      if (linkNode.length === 0) {
        return;
      }
      const bookmark = editor.selection.insertBookmark();
      linkNode.remove(true);
      editor.selection.toBookmark(bookmark);
      editor.history.save();
      return;
    }
    editor.selection.removeMark(`<${tagName} />`);
    editor.history.save();
  });
};
