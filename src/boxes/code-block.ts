import {
  basicSetup,
  EditorView,
  ViewUpdate,
  keymap,
  indentWithTab,
  javascript,
} from '../codemirror';
import type { BoxComponent } from '..';
import { query } from '../utils';

type CodeMirrorConfig = {
  parent:  Element;
  value: string;
  onChange: (value: string) => void;
};

function CodeMirror(config: CodeMirrorConfig): EditorView {
  const updateListener = (update: ViewUpdate) => {
    if (!update.docChanged) {
      return;
    }
    config.onChange(update.state.doc.toString());
  };
  return new EditorView({
    doc: config.value,
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      javascript(),
      EditorView.updateListener.of(updateListener),
    ],
    parent: config.parent,
  });
}

export const codeBlockBox: BoxComponent = {
  type: 'block',
  name: 'codeBlock',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const width = editor.innerWidth() - 2;
    const root = query('<div class="lake-code-block" />');
    root.css('width', `${width}px`);
    const container = box.getContainer();
    container.empty();
    container.append(root);
    const parent = root.get(0);
    if (!parent) {
      return;
    }
    const onChangeHandler = (value: string) => {
      // Here setTimeout is necessary because isComposing is not false after ending composition.
      window.setTimeout(() => {
        if (editor.isComposing) {
          return;
        }
        box.updateValue('code', value);
        editor.history.save();
      }, 0);
    };
    const codeEditor = CodeMirror({
      parent: root.get(0) as Element,
      value: box.value.code ?? '',
      onChange: onChangeHandler,
    });
    box.setData('codeEditor', codeEditor);
  },
};
