import type { Editor } from '../editor';
import { NativeNode } from '../types/native';
import { AppliedItem } from '../types/object';
import { icons } from '../icons';
import { headingMenuItems, fontSizeMenuItems } from '../config/menu-items';
import { template } from '../utils/template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';

type ButtonItem = {
  name: string,
  type: 'button',
  icon?: string,
  tooltipText: string,
  onClick: (editor: Editor, value?: string) => void,
};

type DropdownItem = {
  name: string,
  type: 'dropdown',
  defaultValue: string,
  tooltipText: string,
  width: string,
  menuItems: typeof fontSizeMenuItems,
  getValue: (appliedItems: AppliedItem[]) => string,
  onSelect: (editor: Editor, value?: string) => void,
};

type ToolbarItem = ButtonItem | DropdownItem;

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
    tooltipText: 'Undo',
    onClick: editor => {
      editor.command.execute('undo');
    },
  },
  {
    name: 'redo',
    type: 'button',
    icon: icons.get('redo'),
    tooltipText: 'Redo',
    onClick: editor => {
      editor.command.execute('redo');
    },
  },
  {
    name: 'formatPainter',
    type: 'button',
    icon: icons.get('formatPainter'),
    tooltipText: 'Format Painter',
    onClick: editor => {
      editor.command.execute('formatPainter');
    },
  },
  {
    name: 'removeFormat',
    type: 'button',
    icon: icons.get('removeFormat'),
    tooltipText: 'Remove Format',
    onClick: editor => {
      editor.command.execute('removeFormat');
    },
  },
  {
    name: 'bold',
    type: 'button',
    icon: icons.get('bold'),
    tooltipText: 'Bold',
    onClick: editor => {
      editor.command.execute('bold');
    },
  },
  {
    name: 'italic',
    type: 'button',
    icon: icons.get('italic'),
    tooltipText: 'Italic',
    onClick: editor => {
      editor.command.execute('italic');
    },
  },
  {
    name: 'underline',
    type: 'button',
    icon: icons.get('underline'),
    tooltipText: 'Underline',
    onClick: editor => {
      editor.command.execute('underline');
    },
  },
  {
    name: 'moreStyle',
    type: 'button',
    icon: icons.get('more'),
    tooltipText: 'More Styles',
    onClick: editor => {
      // TODO
      editor.command.execute('underline');
    },
  },
  {
    name: 'heading',
    type: 'dropdown',
    defaultValue: 'p',
    tooltipText: 'Heading',
    width: '100px',
    menuItems: headingMenuItems,
    getValue: appliedItems => {
      const currentItem = appliedItems.find(item => item.node.isHeading || item.name === 'p');
      return currentItem ? currentItem.name : '';
    },
    onSelect: (editor, value) => {
      editor.command.execute('heading', value);
    },
  },
  {
    name: 'fontSize',
    type: 'dropdown',
    defaultValue: '16px',
    tooltipText: 'Font Size',
    width: '65px',
    menuItems: fontSizeMenuItems,
    getValue: appliedItems => {
      if (appliedItems.length === 0) {
        return '';
      }
      const currentValue = appliedItems[0].node.computedCSS('font-size');
      return currentValue;
    },
    onSelect: (editor, value) => {
      editor.command.execute('fontSize', value);
    },
  },
];

const defaultConfig: string[] = [
  'undo',
  'redo',
  '|',
  'heading',
  'fontSize',
  '|',
  'formatPainter',
  'removeFormat',
  'bold',
  'italic',
  'underline',
  'moreStyle',
  '|',
  'bold',
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
    });
  }
  */

  private appendButton(item: ButtonItem) {
    const editor = this.editor;
    const buttonNode = query('<button type="button" class="lake-toolbar-item" />');
    buttonNode.attr('name', item.name);
    buttonNode.attr('title', item.tooltipText);
    if (item.icon) {
      buttonNode.append(item.icon);
    }
    this.root.append(buttonNode);
    buttonNode.on('click', event => {
      event.preventDefault();
      editor.focus();
      item.onClick(editor);
    });
  }

  private appendSeparator() {
    this.root.append('<div class="lake-toolbar-separator" />');
  }

  private appendDropdown(item: DropdownItem) {
    const editor = this.editor;
    const menuMap: Map<string, string> = new Map();
    const content = template(`
      <div class="lake-dropdown">
        <button type="button" class="lake-dropdown-title">
          <div class="lake-dropdown-text"></div>
        </button>
      </div>
    `);
    const dropdownNode = query(content);
    dropdownNode.attr('name', item.name);
    const titleNode = dropdownNode.find('.lake-dropdown-title');
    titleNode.css('width', item.width);
    titleNode.attr('title', item.tooltipText);
    const textNode = titleNode.find('.lake-dropdown-text');
    titleNode.append(icons.get('down') ?? '');
    const menuNode = query('<ul class="lake-dropdown-menu" />');
    if (item.menuItems) {
      for (const menuItem of item.menuItems) {
        const listContent = template(`
          <li value="${menuItem.value}">
            <div class="lake-dropdown-menu-text">${menuItem.text}</div>
          </li>
        `);
        const listNode = query(listContent);
        menuNode.append(listNode);
        listNode.prepend(icons.get('check') ?? '');
        menuMap.set(menuItem.value, menuItem.text);
      }
      dropdownNode.append(menuNode);
    }
    textNode.html(menuMap.get(item.defaultValue) ?? item.defaultValue);
    dropdownNode.append(titleNode);
    dropdownNode.append(menuNode);
    this.root.append(dropdownNode);
    titleNode.on('click', event => {
      event.preventDefault();
      const currentValue = dropdownNode.attr('value');
      menuNode.find('svg').css('visibility', 'hidden');
      if (currentValue) {
        const listNode = menuNode.find(`li[value="${currentValue}"]`);
        if (listNode.length > 0) {
          listNode.find('svg').css('visibility', 'visible');
        }
      }
      menuNode.show();
    });
    menuNode.on('click', event => {
      event.preventDefault();
      editor.focus();
      const listItem = query(event.target as NativeNode).closest('li');
      const value = listItem.attr('value');
      textNode.html(listItem.text());
      item.onSelect(editor, value);
    });
    editor.event.on('click', target => {
      if (target.closest('.lake-dropdown-title').get(0) === titleNode.get(0)) {
        return;
      }
      menuNode.hide();
    });
    editor.event.on('selectionchange', () => {
      const currentValue = item.getValue(editor.selection.appliedItems);
      dropdownNode.attr('value', currentValue);
      const key = currentValue || item.defaultValue;
      const text = menuMap.get(key) ?? key;
      textNode.html(text);
    });
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
