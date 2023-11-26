import type Editor from '..';
import { boxes } from '../storage/boxes';

boxes.set('hr', {
  type: 'block',
  name: 'hr',
  render: () => '<hr />',
});

export default (editor: Editor) => {
  editor.command.add('hr', () => {
    editor.focus();
    editor.selection.insertBox('hr');
    editor.history.save();
    editor.select();
  });
};
