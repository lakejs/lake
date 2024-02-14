import { Editor, BoxComponent, Utils } from '../../src';

const { query } = Utils;

declare global {
  interface Window {
    CodeMirror: any;
  }
}

export const codeBlockBox: BoxComponent = {
  type: 'block',
  name: 'codeBlock',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const root = query('<div />');
    const container = box.getContainer();
    container.empty();
    container.append(root);
    const codeEditor = window.CodeMirror(root.get(0), {
      value: box.value.code ?? '',
      mode: 'javascript',
      tabSize: 2,
      lineNumbers: true,
    });
    codeEditor.on('change', (cm: any) => {
      // Here setTimeout is necessary because isComposing is not false after ending composition.
      window.setTimeout(() => {
        if (editor.isComposing) {
          return;
        }
        box.value = {
          code: cm.doc.getValue(),
        };
        editor.history.save();
      }, 0);
    });
  },
};

export default (editor: Editor) => {
  editor.command.add('codeBlock', () => {
    editor.selection.insertBox('codeBlock');
    editor.history.save();
  });
};
