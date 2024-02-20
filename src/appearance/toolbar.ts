import type { Editor } from '../editor';
import { NativeNode } from '../types/native';
import { icons } from '../icons';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';

const headingTypes = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
]);

const listTypes = new Map([
  ['numberedList', 'numbered'],
  ['bulletedList', 'bulleted'],
  ['checklist', 'checklist'],
]);

const alignTypes = new Map([
  ['alignLeft', 'left'],
  ['alignCenter', 'center'],
  ['alignRight', 'right'],
  ['alignJustify', 'justify'],
]);

const indentTypes = new Map([
  ['increaseIndent', 'increase'],
  ['decreaseIndent', 'decrease'],
]);

const noParameterCommandNames = [
  'undo',
  'redo',
  'selectAll',
  'blockQuote',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'code',
  'removeFormat',
  'formatPainter',
  'unlink',
  'hr',
  'codeBlock',
];

const defaultConfig: string[] = [
  'undo',
  'redo',
  '|',
  'formatPainter',
  'removeFormat',
  'bold',
  'italic',
  'underline',
  '|',
  'numberedList',
  'alignLeft',
  'increaseIndent',
  '|',
  'image',
  'link',
  'hr',
  '|',
  'more',
];

export class Toolbar {
  private editor: Editor;

  private config: string[];

  constructor(editor: Editor, config?: string[]) {
    this.editor = editor;
    this.config = config || defaultConfig;
  }

  public render(target: string | Nodes | NativeNode) {
    const targetNode = query(target);
    const editor = this.editor;
    this.config.forEach(name => {
      if (name === '|') {
        const separatorNode = query('<div class="lake-toolbar-separator" />');
        targetNode.append(separatorNode);
        return;
      }
      const iconItem = icons.get(name);
      if (!iconItem) {
        return;
      }
      const itemNode = query('<button class="lake-toolbar-item" />');
      itemNode.attr({
        'data-type': iconItem.name,
        title: iconItem.title,
      });
      itemNode.append(iconItem.node);
      targetNode.append(itemNode);
    });

    targetNode.on('click', event => {
      event.preventDefault();
      event.stopPropagation();
      editor.focus();
      const targetButton = query(event.target as Element).closest('.lake-toolbar-item');
      const type = targetButton.attr('data-type');
      if (headingTypes.has(type)) {
        editor.command.execute('heading', type);
        return;
      }
      if (listTypes.has(type)) {
        editor.command.execute('list', listTypes.get(type));
        return;
      }
      if (alignTypes.has(type)) {
        editor.command.execute('align', alignTypes.get(type));
        return;
      }
      if (indentTypes.has(type)) {
        editor.command.execute('indent', indentTypes.get(type));
        return;
      }
      if (type === 'fontFamily') {
        editor.command.execute('fontFamily', 'Segoe UI');
        return;
      }
      if (type === 'fontSize') {
        editor.command.execute('fontSize', '18px');
        return;
      }
      if (type === 'fontColor') {
        editor.command.execute('fontColor', '#ff0000');
        return;
      }
      if (type === 'highlight') {
        editor.command.execute('highlight', '#0000ff');
        return;
      }
      if (type === 'link') {
        editor.command.execute('link', 'https://github.com/');
        return;
      }
      if (type === 'image') {
        editor.command.execute('image', './data/tianchi.png');
        return;
      }
      if (noParameterCommandNames.indexOf(type) >= 0) {
        editor.command.execute(type);
      }
    });
  }
}
