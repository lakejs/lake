import { basicSetup } from 'codemirror';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import type { BoxComponent } from '..';
import { NativeElement } from '../types/native';
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
    const root = query('<div class="lake-code-block" />');
    const container = box.getContainer();
    container.empty();
    container.append(root);
    const parent = root.get(0);
    if (!parent) {
      return;
    }
    const updateListener = (v: ViewUpdate) => {
      if (!v.docChanged) {
        return;
      }
      // Here setTimeout is necessary because isComposing is not false after ending composition.
      window.setTimeout(() => {
        if (editor.isComposing) {
          return;
        }
        box.updateValue('code', v.state.doc.toString());
        editor.history.save();
      }, 0);
    };
    const codeEditor = new EditorView({
      doc: box.value.code ?? '',
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of(updateListener),
      ],
      parent: root.get(0) as NativeElement,
    });
    box.setData('codeEditor', codeEditor);
  },
};
