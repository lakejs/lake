import type Editor from '..';
import { Box } from '../types/box';

export const hrBox: Box = {
  type: 'block',
  name: 'hr',
  render: () => '<hr />',
};

export default (editor: Editor) => {
  editor.command.add('hr', () => {
    editor.focus();
    const boxNode = editor.selection.insertBox(hrBox);
    editor.box.render(boxNode);
    editor.history.save();
    editor.select();
  });
};
