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
    const root = query('<div class="lake-box-no-focus" />');
    const container = box.getContainer();
    container.empty();
    container.append(root);
    const codeEditor = window.CodeMirror(root.get(0), {
      value: box.value.code ?? '',
      mode: 'javascript',
      lineNumbers: true,
    });
    codeEditor.addKeyMap({
      Backspace: (cm: any) => {
        if (cm.doc.getValue() === '') {
          box.remove();
        }
      },
    });
    codeEditor.on('change', (cm: any) => {
      box.value = {
        code: cm.doc.getValue(),
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
