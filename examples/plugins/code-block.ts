import type Editor from '../../src';
import { BoxComponent } from '../../src';
import { debug, query } from '../../src/utils';

export const codeBlockBox: BoxComponent = {
  type: 'block',
  name: 'codeBlock',
  render: (value, box, editor) => {
    debug(editor);
    const root = query('<div><textarea></textarea></div>');
    const textarea = root.find('textarea');
    if (value) {
      (textarea.get(0) as HTMLTextAreaElement).value = value?.code || '';
    }
    if (box) {
      textarea.on('input', () => {
        box.value = {
          code: (textarea.get(0) as HTMLTextAreaElement).value,
        };
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
