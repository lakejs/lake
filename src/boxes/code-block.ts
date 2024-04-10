import {
  EditorState,
  Compartment,
  EditorView,
  keymap,
  history,
  defaultKeymap,
  historyKeymap,
  indentWithTab,
  HighlightStyle,
  syntaxHighlighting,
  tags,
  langItems,
} from '../codemirror';
import { BoxComponent } from '../types/box';
import { icons } from '../icons';
import { debug, query } from '../utils';
import { Dropdown } from '../ui/dropdown';
import { locale } from '../i18n';

const defaultLangValue = 'text';

const config = {
  dark: false,
  background: '#0000000a',
  foreground: '#444d56',
  selection: '#1ba2e333',
  cursor: '#044289',
  keyword: '#cf222e',
  variable: '#1f2328',
  parameter: '#24292e',
  function: '#005cc5',
  string: '#0a3069',
  constant: '#0550ae',
  type: '#24292f',
  class: '#24292e',
  number: '#0550ae',
  comment: '#57606a',
  heading: '#0550ae',
  invalid: '#f6f8fa',
  regexp: '#116329',
};

const lightHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: config.keyword },
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: config.variable },
  { tag: [tags.propertyName], color: config.function },
  { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: config.string },
  { tag: [tags.function(tags.variableName), tags.labelName], color: config.function },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: config.constant },
  { tag: [tags.definition(tags.name), tags.separator], color: config.variable },
  { tag: [tags.className], color: config.class },
  { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: config.number },
  { tag: [tags.typeName], color: config.type },
  { tag: [tags.operator, tags.operatorKeyword], color: config.keyword },
  { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: config.regexp },
  { tag: [tags.meta, tags.comment], color: config.comment },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: config.heading },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: config.variable },
  { tag: tags.invalid, color: config.invalid },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
]);

const langItemMap: Map<string, typeof langItems[0]> = new Map();
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
    const codeBlockNode = query('<div class="lake-code-block" />');
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
        EditorState.readOnly.of(editor.readonly),
        history(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        syntaxHighlighting(lightHighlightStyle),
        language.of(langItem && langItem.component ? langItem.component() : []),
        updateListener,
      ],
    });
    codeBlockNode.find('[contenteditable="true"]').attr('tabindex', '-1');
    const dropdown = new Dropdown({
      root: codeBlockNode,
      name: 'langType',
      downIcon: icons.get('down'),
      defaultValue: langItem ? boxValue.lang : defaultLangValue,
      tooltip: locale.codeBlock.langType(),
      width: 'auto',
      menuType: 'list',
      menuItems: langItems.map(item => ({
        value: item.value,
        text: item.text,
      })),
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
