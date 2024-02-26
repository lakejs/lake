import { type Editor } from '..';
import { Box } from '../models/box';

export default (editor: Editor) => {
  editor.command.add('codeBlock', () => {
    const boxNode = editor.selection.insertBox('codeBlock');
    editor.history.save();
    const box = new Box(boxNode);
    const codeEditor = box.getData('codeEditor');
    codeEditor.focus();
  });
};
