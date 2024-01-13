import type Editor from '../../src';
import { BoxComponent } from '../../src';

export const codeBlockBox: BoxComponent = {
  type: 'block',
  name: 'codeBlock',
  render: () => '<div><textarea></textarea></div>',
};

export default (editor: Editor) => {
  editor.command.add('codeBlock', () => {
    editor.selection.insertBox('codeBlock');
    editor.history.save();
  });
};
