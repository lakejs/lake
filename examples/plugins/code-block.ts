import type Editor from '../../src';
import { BoxComponent } from '../../src';
import { query } from '../../src/utils';

export const codeBlockBox: BoxComponent = {
  type: 'block',
  name: 'codeBlock',
  render: (value, box) => {
    const root = query('<div><textarea></textarea></div>');
    const textarea = root.find('textarea');
    const nativeTextarea = textarea.get(0) as HTMLTextAreaElement;
    if (value) {
      nativeTextarea.value = value?.code || '';
    }
    if (box) {
      textarea.on('input', () => {
        box.value = {
          code: nativeTextarea.value,
        };
        box.save();
      });
    }
    return root;
  },
};

export default (editor: Editor) => {
  editor.command.add('codeBlock', () => {
    editor.selection.insertBox('codeBlock');
    editor.history.save();
  });
};
