import type { BoxComponent } from '..';
import { query } from '../utils';

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
    box.setData('codeEditor', codeEditor);
    codeEditor.on('change', (cm: any) => {
      // Here setTimeout is necessary because isComposing is not false after ending composition.
      window.setTimeout(() => {
        if (editor.isComposing) {
          return;
        }
        box.updateValue('code', cm.doc.getValue());
        editor.history.save();
      }, 0);
    });
  },
};
