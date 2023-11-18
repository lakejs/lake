import type Editor from '..';
import { Figure } from '../types/figure';

const figure: Figure = {
  type: 'block',
  name: 'hr',
  render: () => '<hr />',
};

export default (editor: Editor) => {
  editor.command.add('hr', () => {
    editor.focus();
    editor.selection.insertFigure(figure);
    editor.history.save();
    editor.select();
  });
};
