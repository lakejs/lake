import type { Editor } from '../editor';
import { NativeNode } from '../types/native';
import { icons } from '../icons';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';

type MenuItem = {
  value: string,
  text: string,
};

type ToolbarItem = {
  name: string,
  type: 'button' | 'dropdown',
  text?: string,
  icon?: NativeNode,
  tooltip: string,
  menu?: MenuItem[],
  callback: (editor: Editor, value?: string) => void,
};

/*
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
  'selectAll',
  'blockQuote',
  'strikethrough',
  'subscript',
  'superscript',
  'code',
  'unlink',
  'hr',
  'codeBlock',
];
*/

const toolbarItemList: ToolbarItem[] = [
  {
    name: 'undo',
    type: 'button',
    icon: icons.get('undo'),
    tooltip: 'Undo',
    callback: editor => {
      editor.command.execute('undo');
    },
  },
  {
    name: 'redo',
    type: 'button',
    icon: icons.get('redo'),
    tooltip: 'Redo',
    callback: editor => {
      editor.command.execute('redo');
    },
  },
  {
    name: 'formatPainter',
    type: 'button',
    icon: icons.get('formatPainter'),
    tooltip: 'Format Painter',
    callback: editor => {
      editor.command.execute('formatPainter');
    },
  },
  {
    name: 'removeFormat',
    type: 'button',
    icon: icons.get('removeFormat'),
    tooltip: 'Remove Format',
    callback: editor => {
      editor.command.execute('removeFormat');
    },
  },
  {
    name: 'bold',
    type: 'button',
    icon: icons.get('bold'),
    tooltip: 'Bold',
    callback: editor => {
      editor.command.execute('bold');
    },
  },
  {
    name: 'italic',
    type: 'button',
    icon: icons.get('italic'),
    tooltip: 'Italic',
    callback: editor => {
      editor.command.execute('italic');
    },
  },
  {
    name: 'underline',
    type: 'button',
    icon: icons.get('underline'),
    tooltip: 'Underline',
    callback: editor => {
      editor.command.execute('underline');
    },
  },
  {
    name: 'heading',
    type: 'dropdown',
    text: 'Heading 1',
    tooltip: 'Heading',
    menu: [
      {
        value: 'h1',
        text: 'Heading 1',
      },
      {
        value: 'h2',
        text: 'Heading 2',
      },
      {
        value: 'h3',
        text: 'Heading 3',
      },
      {
        value: 'h4',
        text: 'Heading 4',
      },
      {
        value: 'h5',
        text: 'Heading 5',
      },
      {
        value: 'h6',
        text: 'Heading 6',
      },
      {
        value: 'p',
        text: 'Paragraph',
      },
    ],
    callback: (editor, value) => {
      editor.command.execute('heading', value);
    },
  },
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
];

const toolbarItemMap: Map<string, ToolbarItem> = new Map();

toolbarItemList.forEach(item => {
  toolbarItemMap.set(item.name, item);
});

export class Toolbar {
  private editor: Editor;

  private config: string[];

  private root: Nodes;

  constructor(editor: Editor, config?: string[]) {
    this.editor = editor;
    this.config = config || defaultConfig;
    this.root = query('<div />');
  }

  /*
  private bindClickEvent() {
    const editor = this.editor;
    this.root.on('click', event => {
      event.preventDefault();
      event.stopPropagation();
      editor.focus();
      const targetItem = query(event.target as Element).closest('.lake-toolbar-item');
      const type = targetItem.attr('data-type');
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
  */

  private appendButton(item: ToolbarItem) {
    const editor = this.editor;
    const buttonNode = query('<button class="lake-toolbar-item" />');
    buttonNode.attr({
      title: item.tooltip,
    });
    if (item.icon) {
      buttonNode.append(item.icon);
    }
    this.root.append(buttonNode);
    buttonNode.on('click', event => {
      event.preventDefault();
      event.stopPropagation();
      editor.focus();
      item.callback(editor);
    });
  }

  private appendSeparator() {
    this.root.append('<div class="lake-toolbar-separator" />');
  }

  private appendDropdown(item: ToolbarItem) {
    const editor = this.editor;
    const dropdownNode = query('<div class="lake-dropdown" />');
    const titleNode = query(`<div class="lake-dropdown-title"><div class="lake-dropdown-text">${item.text}</div><div class="lake-dropdown-icon"></div></div>`);
    const textNode = titleNode.find('.lake-dropdown-text');
    const icon = icons.get('down');
    if (icon) {
      titleNode.find('.lake-dropdown-icon').append(icon);
    }
    const menuNode = query('<ul class="lake-dropdown-menu" />');
    if (item.menu) {
      for (const menuItem of item.menu) {
        menuNode.append(`<li data-value="${menuItem.value}">${menuItem.text}</li>`);
      }
      dropdownNode.append(menuNode);
    }
    dropdownNode.append(titleNode);
    dropdownNode.append(menuNode);
    this.root.append(dropdownNode);
    titleNode.on('click', event => {
      event.preventDefault();
      event.stopPropagation();
      menuNode.show();
    });
    menuNode.on('click', event => {
      event.preventDefault();
      editor.focus();
      const listItem = query(event.target as NativeNode).closest('li');
      const value = listItem.attr('data-value');
      textNode.html(listItem.text());
      item.callback(editor, value);
    });
    editor.event.on('click', () => menuNode.hide());
  }

  public render(target: string | Nodes | NativeNode) {
    this.root = query(target);
    this.config.forEach(name => {
      if (name === '|') {
        this.appendSeparator();
        return;
      }
      const item = toolbarItemMap.get(name);
      if (!item) {
        return;
      }
      if (item.type === 'button') {
        this.appendButton(item);
        return;
      }
      if (item.type === 'dropdown') {
        this.appendDropdown(item);
      }
    });
  }
}
