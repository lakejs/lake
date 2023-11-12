import type Editor from '..';

export default (editor: Editor) => {
  editor.command.add('formatPainter', () => {
    editor.focus();
    editor.container.addClass('lake-format-painter');
  });
};
