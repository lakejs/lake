import type Editor from '../../src';
import { BoxComponent } from '../../src';
import { query } from '../../src/utils';

declare global {
  interface Window {
    CodeMirror: any;
  }
}

export const codeBlockBox: BoxComponent = {
  type: 'block',
  name: 'codeBlock',
  render: (value, box) => {
    const root = query('<div class="lake-box-editarea" />');
    window.setTimeout(() => {
      value = value || {};
      const codeMirror = window.CodeMirror(root.get(0), {
        value: value.code ?? '',
        mode: 'javascript',
        lineNumbers: true,
      });
      if (box) {
        codeMirror.on('change', (instance: any) => {
          box.value = {
            code: instance.doc.getValue(),
          };
          box.save();
        });
      }
    });
    return root;
  },
};

export default (editor: Editor) => {
  editor.command.add('codeBlock', () => {
    editor.selection.insertBox('codeBlock');
    editor.history.save();
  });
};
