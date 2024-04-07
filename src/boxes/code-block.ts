import {
  basicSetup,
  Compartment,
  EditorView,
  keymap,
  indentWithTab,
  cpp,
  css,
  go,
  html,
  java,
  javascript,
  json,
  markdown,
  php,
  python,
  rust,
  xml,
  yaml,
} from '../codemirror';
import { BoxComponent } from '../types/box';
import { icons } from '../icons';
import { debug, query } from '../utils';
import { Dropdown } from '../ui/dropdown';

type LangItem = {
  value: string,
  text: string,
  component?: typeof cpp,
};

const defaultLangValue = 'text';

const langItems: LangItem[] = [
  { value: 'text', text: 'Plain text' },
  { value: 'cpp', text: 'C++', component: cpp },
  { value: 'css', text: 'CSS', component: css },
  { value: 'go', text: 'Go', component: go },
  { value: 'html', text: 'HTML', component: html },
  { value: 'java', text: 'Java', component: java },
  { value: 'javascript', text: 'JavaScript', component: javascript },
  { value: 'json', text: 'JSON', component: json },
  { value: 'markdown', text: 'Markdown', component: markdown },
  { value: 'php', text: 'PHP', component: php },
  { value: 'python', text: 'Python', component: python },
  { value: 'rust', text: 'Rust', component: rust },
  { value: 'xml', text: 'XML', component: xml },
  { value: 'yaml', text: 'YAML', component: yaml },
];

const langItemMap: Map<string, LangItem> = new Map();
for (const item of langItems) {
  langItemMap.set(item.value, item);
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
    const codeBlockNativeNode = codeBlockNode.get(0) as HTMLElement;
    if (!codeBlockNativeNode) {
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
    const language = new Compartment();
    const updateListener = EditorView.updateListener.of(update => {
      if (!update.docChanged) {
        return;
      }
      onChangeHandler(update.state.doc.toString());
    });
    const boxValue = box.value;
    const langItem = langItemMap.get(boxValue.lang);
    const codeEditor = new EditorView({
      parent: codeBlockNativeNode,
      doc: boxValue.code ?? '',
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        language.of(langItem && langItem.component ? langItem.component() : []),
        updateListener,
      ],
    });
    const dropdown = new Dropdown({
      root: codeBlockNode,
      name: 'langType',
      downIcon: icons.get('down'),
      defaultValue: langItem ? boxValue.lang : defaultLangValue,
      tooltip: 'Select language',
      width: 'auto',
      menuType: 'list',
      menuItems: langItems.map(item => ({
        value: item.value,
        text: item.text,
      })),
      hasDocumentClick: true,
      onSelect: value => {
        const item = langItemMap.get(value);
        codeEditor.dispatch({
          effects: language.reconfigure(item && item.component ? item.component() : []),
        });
        box.updateValue({
          lang: value,
        });
        editor.history.save();
      },
    });
    dropdown.render();
    box.setData('codeEditor', codeEditor);
    box.useEffect(() => () => {
      codeEditor.destroy();
      debug('CodeMirror destroyed');
    });
  },
};
