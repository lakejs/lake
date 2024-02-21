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
  'heading',
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
  '|',
  'more',
];

export class Toolbar {
  private editor: Editor;

  private config: string[];

  private root: Nodes;

  constructor(editor: Editor, config?: string[]) {
    this.editor = editor;
    this.config = config || defaultConfig;
    this.root = query('<div />');
  }

  private bindClickEvent() {
    const editor = this.editor;
    this.root.on('click', event => {
      event.preventDefault();
      event.stopPropagation();
      editor.focus();
      const targetItem = query(event.target as Element).closest('.lake-toolbar-item');
      const type = targetItem.attr('data-type');
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

  public render(target: string | Nodes | NativeNode) {
    this.root = query(target);
    this.config.forEach(name => {
      if (name === '|') {
        const separatorNode = query('<div class="lake-toolbar-separator" />');
        this.root.append(separatorNode);
        return;
      }
      if (name === 'heading') {
        const dropdownNode = query('<div class="lake-dropdown"><div class="lake-dropdown-title"><div class="lake-dropdown-text">Heading 1</div><div class="lake-dropdown-icon"></div></div></div>');
        const downIconItem = icons.get('down');
        if (downIconItem) {
          dropdownNode.find('.lake-dropdown-icon').append(downIconItem.node);
        }
        dropdownNode.append('<ul class="lake-dropdown-menu"><li>Heading 1</li><li>Heading 2</li><li>Heading 3</li><li>Paragraph</li></ul>');
        this.root.append(dropdownNode);
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
      this.root.append(itemNode);
    });
    this.bindClickEvent();
  }
}
