import type Editor from '..';
import { Box } from '../types/box';

const box: Box = {
  type: 'block',
  name: 'hr',
  render: () => '<hr />',
};

export default (editor: Editor) => {
  editor.command.add('hr', () => {
    editor.focus();
    editor.selection.insertBox(box);
    editor.history.save();
    editor.select();
  });
};
