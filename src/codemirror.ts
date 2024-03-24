import { basicSetup } from 'codemirror';
import { EditorView, ViewUpdate, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';

type Config = {
  parent:  Element;
  defaultValue: string;
  onChange: (value: string) => void;
};

export default function(config: Config): EditorView {
  const updateListener = (update: ViewUpdate) => {
    if (!update.docChanged) {
      return;
    }
    config.onChange(update.state.doc.toString());
  };
  return new EditorView({
    doc: config.defaultValue,
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      javascript(),
      EditorView.updateListener.of(updateListener),
    ],
    parent: config.parent,
  });
}
