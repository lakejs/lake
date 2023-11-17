import type Editor from '..';
import { FigureItem } from '../types/figure';

const figure: FigureItem = {
  type: 'block',
  name: 'hr',
  value: {},
  render: () => '<div class="hr" />',
};

export default (editor: Editor) => {
  editor.command.add('hr', () => {
    editor.focus();
    editor.selection.insertFigure(figure);
    editor.history.save();
    editor.select();
  });
};
