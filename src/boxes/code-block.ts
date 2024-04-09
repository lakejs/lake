import {
  basicSetup,
  Compartment,
  EditorView,
  keymap,
  indentWithTab,
  langItems,
} from '../codemirror';
import { BoxComponent } from '../types/box';
import { icons } from '../icons';
import { debug, query } from '../utils';
import { Dropdown } from '../ui/dropdown';
import { locale } from '../i18n';

const defaultLangValue = 'text';

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
