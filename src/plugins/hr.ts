import type Editor from '..';
import { Figure } from '../models/figure';
import { debug } from '../utils/debug';

class HrFigure extends Figure {
  constructor() {
    super();
    debug('render method');
  }
}

export default (editor: Editor) => {
  editor.command.add('hr', () => {
    editor.focus();
    const figure = new HrFigure();
    editor.selection.insertFigure(figure);
    editor.history.save();
    editor.select();
  });
};
