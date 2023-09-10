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
    event.stopImmediatePropagation();
    debug('The Shift+Enter keys were pressed at the same time. ', event);
  });
  editor.keystroke.setKeydown('Enter', event => {
    event.preventDefault();
    debug('The Enter key was pressed. ', event);
  });
};
