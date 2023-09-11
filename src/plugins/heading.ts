import { debug } from '../utils/debug';
import type LakeCore from '../main';

export default (editor: LakeCore) => {
  editor.commands.add('heading', (type: string) => {
    editor.focus();
    editor.selection.setBlocks(`<${type} />`);
    editor.select();
  });
  editor.keystroke.setKeydown('Shift+Enter', event => {
    event.preventDefault();
    editor.selection.insertContents('<br />&NoBreak;');
  });
  editor.keystroke.setKeydown('Enter', event => {
    event.preventDefault();
    debug('The Enter key was pressed. ', event);
  });
};
