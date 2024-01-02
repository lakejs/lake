import type Editor from '../../src';
import { BoxDefinition } from '../../src';

export const codeBlockBox: BoxDefinition = {
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
