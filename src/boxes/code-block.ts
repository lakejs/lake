import {
  basicSetup,
  EditorView,
  ViewUpdate,
  keymap,
  indentWithTab,
  javascript,
} from '../codemirror';
import { debug, query } from '../utils';
import type { BoxComponent } from '..';

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
    const codeBlockNode = query('<div class="lake-code-block" />');
    codeBlockNode.css('width', `${width}px`);
    const container = box.getContainer();
    container.empty();
    container.append(codeBlockNode);
    const parent = codeBlockNode.get(0);
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
      parent: codeBlockNode.get(0) as Element,
      value: box.value.code ?? '',
      onChange: onChangeHandler,
    });
    box.setData('codeEditor', codeEditor);
    box.useEffect(() => () => {
      codeEditor.destroy();
      debug('CodeMirror destroyed');
    });
  },
};
