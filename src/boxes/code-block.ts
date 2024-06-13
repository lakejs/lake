import { BoxComponent } from '../types/box';
import { icons } from '../icons';
import { debug, query } from '../utils';
import { Dropdown } from '../ui/dropdown';

const config = {
  comment: '#57606a',
  name: '#444d56',
  variableName: '#953800',
  typeName: '#0550ae',
  propertyName: '#444d56',
  className: '#24292e',
  labelName: '#005cc5',
  namespace: '#0550ae',
  macroName: '#444d56',
  literal: '#444d56',
  string: '#0a3069',
  number: '#0550ae',
  bool: '#0550ae',
  regexp: '#116329',
  color: '#0550ae',
  keyword: '#cf222e',
  modifier: '#24292f',
  operator: '#cf222e',
  bracket: '#57606a',
  content: '#57606a',
  meta: '#8250df',
  heading: '#0550ae',
  invalid: '#f6f8fa',
  definition: '#cf222e',
  constant: '#0550ae',
  function: '#005cc5',
  standard: '#444d56',
  special: '#444d56',
};

// https://lezer.codemirror.net/docs/ref/#highlight.tags
function getHighlightStyle(CodeMirror: any) {
  const { HighlightStyle, tags } = CodeMirror;
  return HighlightStyle.define([
    { tag: [tags.comment, tags.lineComment, tags.blockComment, tags.docComment], color: config.comment },
    { tag: [tags.name], color: config.name },
    { tag: [tags.variableName, tags.self], color: config.variableName },
    { tag: [tags.typeName, tags.tagName], color: config.typeName },
    { tag: [tags.propertyName, tags.attributeName], color: config.propertyName },
    { tag: [tags.className], color: config.className },
    { tag: [tags.labelName], color: config.labelName },
    { tag: [tags.namespace], color: config.namespace },
    { tag: [tags.macroName], color: config.macroName },
    { tag: [tags.literal], color: config.literal },
    { tag: [tags.string, tags.docString, tags.character, tags.attributeValue, tags.unit], color: config.string },
    { tag: [tags.number, tags.integer, tags.float], color: config.number },
    { tag: [tags.bool, tags.null, tags.atom], color: config.bool },
    { tag: [tags.regexp, tags.escape, tags.url], color: config.regexp },
    { tag: [tags.color], color: config.color },
    { tag: [
      tags.keyword, tags.operatorKeyword, tags.controlKeyword,
      tags.definitionKeyword, tags.moduleKeyword,
    ], color: config.keyword },
    { tag: [tags.modifier], color: config.modifier },
    { tag: [
      tags.operator, tags.derefOperator, tags.arithmeticOperator, tags.logicOperator, tags.bitwiseOperator,
      tags.compareOperator, tags.updateOperator, tags.definitionOperator, tags.typeOperator, tags.controlOperator,
    ], color: config.operator },
    { tag: [
      tags.punctuation, tags.separator, tags.bracket, tags.angleBracket, tags.squareBracket,
      tags.paren, tags.brace, tags.contentSeparator,
    ], color: config.bracket },
    { tag: [tags.content], color: config.content },
    { tag: [tags.meta, tags.documentMeta, tags.annotation, tags.processingInstruction], color: config.meta },
    { tag: tags.heading, fontWeight: 'bold', color: config.heading },
    { tag: tags.strong, fontWeight: 'bold' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.link, textDecoration: 'underline' },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
    { tag: [tags.invalid, tags.inserted, tags.deleted, tags.changed], color: config.invalid },
    { tag: [tags.definition(tags.name)], color: config.definition },
    { tag: [tags.constant(tags.name)], color: config.constant },
    { tag: [tags.function(tags.variableName)], color: config.function },
    { tag: [tags.standard(tags.name)], color: config.standard },
    { tag: [tags.special(tags.variableName)], color: config.special },
  ]);
}

export const codeBlockBox: BoxComponent = {
  type: 'block',
  name: 'codeBlock',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const rootNode = query('<div class="lake-code-block" />');
    const container = box.getContainer();
    container.css('width', `${editor.container.innerWidth() - 2}px`);
    container.empty();
    container.append(rootNode);
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
    const codeBlockConfig = editor.config.codeBlock;
    const langItems = defaultLangItems.filter(
      (item: any) => codeBlockConfig.langList.indexOf(item.value) >= 0,
    );
    // language menu items
    const langItemMap: Map<string, any> = new Map();
    for (const item of langItems) {
      langItemMap.set(item.value, item);
    }
    const boxValue = box.value;
    const langItem = langItemMap.get(boxValue.lang);
    const language = new Compartment();
    const changeHandler = (value: string) => {
      // Here setTimeout is necessary because isComposing is not false after ending composition.
      window.setTimeout(() => {
        if (editor.isComposing) {
          return;
        }
        box.updateValue('code', value);
        editor.history.save();
      }, 0);
    };
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
        syntaxHighlighting(getHighlightStyle(CodeMirror)),
        language.of(langItem && langItem.component ? langItem.component() : []),
        updateListener,
      ],
    });
    rootNode.find('[contenteditable="true"]').attr('tabindex', '-1');
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'langType',
      downIcon: icons.get('down'),
      defaultValue: langItem ? boxValue.lang : codeBlockConfig.defaultLang,
      tooltip: editor.locale.codeBlock.langType(),
      width: 'auto',
      menuType: 'list',
      menuItems: langItems.map((item: any) => ({
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
    const resizeListener = () => {
      container.css('width', `${editor.container.innerWidth() - 2}px`);
    };
    editor.event.on('resize', resizeListener);
    rootNode.on('click', () => {
      if (codeEditor.hasFocus) {
        return;
      }
      codeEditor.focus();
    });
    box.event.on('beforeunmount', () => {
      codeEditor.destroy();
      editor.event.off('resize', resizeListener);
      debug('CodeMirror destroyed');
    });
  },
};
