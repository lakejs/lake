import type Editor from '..';
import { BoxComponent } from '../types/box';

export const hrBox: BoxComponent = {
  type: 'block',
  name: 'hr',
  render: () => '<hr />',
};

export default (editor: Editor) => {
  editor.command.add('hr', () => {
    editor.selection.insertBox('hr');
    editor.history.save();
  });
};
