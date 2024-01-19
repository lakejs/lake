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
    if (!box) {
      return;
    }
    const root = query('<div class="lake-box-no-focus" />');
    const container = box.getContainer();
    container.empty();
    container.append(root);
    value = value || {};
    const codeMirror = window.CodeMirror(root.get(0), {
      value: value.code ?? '',
      mode: 'javascript',
      lineNumbers: true,
    });
    codeMirror.on('change', (instance: any) => {
      box.value = {
        code: instance.doc.getValue(),
      };
      box.save();
    });
  },
};

export default (editor: Editor) => {
  editor.command.add('codeBlock', () => {
    editor.selection.insertBox('codeBlock');
    editor.history.save();
  });
};
