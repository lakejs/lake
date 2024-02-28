import { Base64 } from 'js-base64';
import type { Editor } from '../editor';
import { NativeNode } from '../types/native';
import { ButtonItem, DropdownItem, ToolbarItem } from '../types/toolbar';
import { icons } from '../icons';
import { toolbarItems } from '../config/toolbar-items';
import { template } from '../utils/template';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';

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
  'moreStyle',
  '|',
  'codeBlock',
  'blockQuote',
  'hr',
];

const toolbarItemMap: Map<string, ToolbarItem> = new Map();

toolbarItems.forEach(item => {
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
  // Returns the value of the node.
  public getValue(node: Nodes): string[] {
    const value = node.attr('value');
    if (value === '') {
      return [];
    }
    return JSON.parse(Base64.decode(value));
  }

  // Updates the value of the node.
  public setValue(node: Nodes, value: string[]) {
    node.attr('value', Base64.encode(JSON.stringify(value)));
  }

  private appendButton(item: ButtonItem) {
    const editor = this.editor;
    const buttonNode = query('<button type="button" class="lake-toolbar-button" />');
    buttonNode.attr('name', item.name);
    buttonNode.attr('title', item.tooltipText);
    if (item.icon) {
      buttonNode.append(item.icon);
    }
    this.root.append(buttonNode);
    buttonNode.on('click', event => {
      event.preventDefault();
      editor.focus();
      item.onClick(editor, item.name);
    });
  }

  private appendSeparator() {
    this.root.append('<div class="lake-toolbar-separator" />');
  }

  private appendDropdown(item: DropdownItem) {
    const editor = this.editor;
    const menuMap: Map<string, string> = new Map();
    const dropdownNode = item.icon ? query(safeTemplate`
      <div class="lake-dropdown">
        <button type="button" class="lake-dropdown-title">
          <div class="lake-dropdown-icon"></div>
          <div class="lake-dropdown-down-icon"></div>
        </button>
      </div>
    `) : query(safeTemplate`
      <div class="lake-dropdown">
        <button type="button" class="lake-dropdown-title">
          <div class="lake-dropdown-text"></div>
          <div class="lake-dropdown-down-icon"></div>
        </button>
      </div>
    `);
    dropdownNode.attr('name', item.name);
    const titleNode = dropdownNode.find('.lake-dropdown-title');
    titleNode.css('width', item.width);
    titleNode.attr('title', item.tooltipText);
    const textNode = titleNode.find('.lake-dropdown-text');
    if (item.icon) {
      const iconNode = titleNode.find('.lake-dropdown-icon');
      iconNode.append(item.icon);
    } else {
      const downIcon = icons.get('down');
      if (downIcon) {
        const downIconNode = titleNode.find('.lake-dropdown-down-icon');
        downIconNode.append(downIcon);
      }
    }
    const menuNode = query('<ul class="lake-dropdown-menu" />');
    if (item.menuItems) {
      for (const menuItem of item.menuItems) {
        const listContent = template`
          <li value="${menuItem.value}">
            <div class="lake-dropdown-menu-text">${menuItem.text}</div>
          </li>
        `;
        const listNode = query(listContent);
        menuNode.append(listNode);
        if (menuItem.icon) {
          const iconNode = query('<div class="lake-dropdown-menu-icon"></div>');
          iconNode.append(menuItem.icon);
          listNode.prepend(iconNode);
        }
        const checkIcon = icons.get('check');
        if (checkIcon) {
          const checkNode = query('<div class="lake-dropdown-menu-check"></div>');
          checkNode.append(checkIcon);
          listNode.prepend(checkNode);
        }
        // remove HTML tags
        const text = menuItem.text.replace(/<[^>]*>/, '');
        menuMap.set(menuItem.value, text);
      }
      dropdownNode.append(menuNode);
    }
    if (textNode.length > 0) {
      textNode.html(menuMap.get(item.defaultValue) ?? item.defaultValue);
    }
    dropdownNode.append(titleNode);
    dropdownNode.append(menuNode);
    this.root.append(dropdownNode);
    titleNode.on('click', event => {
      event.preventDefault();
      const currentValues = this.getValue(dropdownNode);
      menuNode.find('.lake-dropdown-menu-check').css('visibility', 'hidden');
      menuNode.find('li').each(node => {
        const listNode = query(node);
        if (currentValues.indexOf(listNode.attr('value')) >= 0) {
          listNode.find('.lake-dropdown-menu-check').css('visibility', 'visible');
        }
      });
      menuNode.show();
    });
    menuNode.on('click', event => {
      event.preventDefault();
      editor.focus();
      const listItem = query(event.target as NativeNode).closest('li');
      const value = listItem.attr('value');
      if (textNode.length > 0) {
        textNode.html(listItem.text());
      }
      item.onSelect(editor, value);
    });
    editor.event.on('click', target => {
      if (target.closest('.lake-dropdown-title').get(0) === titleNode.get(0)) {
        return;
      }
      menuNode.hide();
    });
    editor.event.on('selectionchange', () => {
      const appliedItems = editor.selection.appliedItems;
      const currentValues = appliedItems.length > 0 ? item.getValues(appliedItems) : [];
      this.setValue(dropdownNode, currentValues);
      if (textNode.length > 0) {
        const key = currentValues[0] || item.defaultValue;
        const text = menuMap.get(key) ?? key;
        textNode.html(text);
      }
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
