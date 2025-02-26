import './code-block-box.css';
import debounce from 'debounce';
import { BoxComponent } from '@/types/box';
import { icons } from '@/icons';
import { debug } from '@/utils/debug';
import { query } from '@/utils/query';
import { Dropdown } from '@/ui/dropdown';

// https://lezer.codemirror.net/docs/ref/#highlight.tags
function getHighlightStyle(CodeMirror: any, colors: Record<string, string>): any {
  const { HighlightStyle, tags } = CodeMirror;
  return HighlightStyle.define([
    { tag: [tags.keyword], color: colors.keyword },
    { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: colors.name },
    { tag: [tags.function(tags.variableName), tags.labelName], color: colors.function },
    { tag: [tags.constant(tags.name), tags.color, tags.standard(tags.name)], color: colors.constant },
    { tag: [tags.definition(tags.name), tags.separator], color: colors.definition },
    { tag: [tags.typeName, tags.className, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: colors.type },
    { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)], color: colors.operator },
    { tag: [tags.comment, tags.meta], color: colors.comment },
    { tag: [tags.strong], fontWeight: 'bold' },
    { tag: [tags.emphasis], fontStyle: 'italic' },
    { tag: [tags.strikethrough], textDecoration: 'line-through' },
    { tag: [tags.link], textDecoration: 'underline' },
    { tag: [tags.heading], fontWeight: 'bold', color: colors.heading },
    { tag: [tags.bool, tags.atom, tags.special(tags.variableName)], color: colors.boolean },
    { tag: [tags.string, tags.processingInstruction, tags.inserted], color: colors.string },
    { tag: [tags.number], color: colors.number },
    { tag: [tags.invalid], color: colors.invalid },
  ]);
}

export default {
  type: 'block',
  name: 'codeBlock',
  render: box => {
    const editor = box.getEditor();
    const rootNode = query('<div class="lake-code-block" />');
    const boxContainer = box.getContainer();
    boxContainer.empty();
    boxContainer.append(rootNode);
    const codeBlockNativeNode = rootNode.get(0) as HTMLElement;
    if (!codeBlockNativeNode) {
      return;
    }
    // begin to create CodeMirror
    const CodeMirror = window.LakeCodeMirror;
    if (!CodeMirror) {
      if (editor.readonly) {
        box.node.hide();
        return;
      }
      rootNode.addClass('lake-code-block-error');
      rootNode.text(`
        The code cannot be displayed because window.LakeCodeMirror is not found.
        Please check if the "lake-codemirror" library is added to this page.
      `.trim());
      rootNode.on('click', () => {
        editor.selection.selectBox(box);
      });
      return;
    }
    const {
      EditorState, Compartment, EditorView,
      keymap, history, defaultKeymap, historyKeymap,
      indentWithTab, syntaxHighlighting,
    } = CodeMirror;
    const defaultLangItems = CodeMirror.langItems;
    const { langList, defaultLang, colors } = editor.config.codeBlock;
    const langItems = defaultLangItems.filter(
      (item: any) => langList.indexOf(item.value) >= 0,
    );
    // language menu items
    const langItemMap = new Map<string, any>();
    for (const item of langItems) {
      langItemMap.set(item.value, item);
    }
    const boxValue = box.value;
    const langItem = langItemMap.get(boxValue.lang);
    const language = new Compartment();
    const changeHandler = debounce((value: string) => {
      editor.selection.updateByRange();
      if (editor.isComposing) {
        return;
      }
      box.updateValue('code', value);
      editor.history.save();
    }, 1, {
      immediate: false,
    });
    const updateListener = EditorView.updateListener.of((update: any) => {
      if (!update.docChanged) {
        return;
      }
      changeHandler(update.state.doc.toString());
    });
    const codeEditor = new EditorView({
      parent: codeBlockNativeNode,
      doc: boxValue.code ?? '',
      extensions: [
        EditorState.readOnly.of(editor.readonly),
        EditorView.editable.of(!editor.readonly),
        history(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        syntaxHighlighting(getHighlightStyle(CodeMirror, colors)),
        language.of(langItem && langItem.component ? langItem.component() : []),
        updateListener,
      ],
    });
    rootNode.find('[contenteditable="true"]').attr('tabindex', '-1');
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'langType',
      downIcon: icons.get('down'),
      defaultValue: langItem ? boxValue.lang : defaultLang,
      tooltip: editor.locale.codeBlock.langType(),
      location: 'global',
      menuType: 'list',
      menuHeight: '200px',
      menuItems: langItems.map((item: any) => ({
        value: item.value,
        text: item.text,
      })),
      onSelect: value => {
        box.updateValue({
          lang: value,
        });
        box.unmount();
        box.render();
        editor.selection.selectBox(box);
        editor.history.save();
      },
    });
    dropdown.render();
    rootNode.on('click', () => {
      if (codeEditor.hasFocus) {
        return;
      }
      codeEditor.focus();
    });
    box.event.on('beforeunmount', () => {
      dropdown.unmount();
      codeEditor.destroy();
      debug('CodeMirror destroyed');
    });
  },
} as BoxComponent;
