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
  'fontColor',
  'highlight',
  '|',
  'align',
  'list',
  'indent',
  'link',
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
    buttonNode.attr('title', item.tooltip);
    if (item.icon) {
      buttonNode.append(item.icon);
    }
    this.root.append(buttonNode);
    buttonNode.on('mouseenter', () => {
      buttonNode.addClass('lake-toolbar-button-hovered');
    });
    buttonNode.on('mouseleave', () => {
      buttonNode.removeClass('lake-toolbar-button-hovered');
    });
    buttonNode.on('click', event => {
      event.preventDefault();
      editor.focus();
      item.onClick(editor, item.name);
    });
  }

  private appendDivider() {
    this.root.append('<div class="lake-toolbar-divider" />');
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
    dropdownNode.attr('type', item.icon ? 'icon' : 'text');
    dropdownNode.attr('name', item.name);
    const titleNode = dropdownNode.find('.lake-dropdown-title');
    if (!item.downIcon) {
      titleNode.addClass('lake-dropdown-title-no-down');
    }
    titleNode.css('width', item.width);
    titleNode.attr('title', item.tooltip);
    const textNode = titleNode.find('.lake-dropdown-text');
    if (item.icon) {
      const iconNode = titleNode.find('.lake-dropdown-icon');
      iconNode.append(item.icon);
    }
    if (item.downIcon) {
      const downIconNode = titleNode.find('.lake-dropdown-down-icon');
      downIconNode.append(item.downIcon);
    }
    const menuNode = query('<ul class="lake-dropdown-menu" />');
    menuNode.addClass(`lake-dropdown-${item.menuType}-menu`);
    if (item.menuItems) {
      for (const menuItem of item.menuItems) {
        const listContent = template`
          <li value="${menuItem.value}">
            <div class="lake-dropdown-menu-text">${menuItem.text}</div>
          </li>
        `;
        const listNode = query(listContent);
        menuNode.append(listNode);
        if (item.menuType === 'color') {
          listNode.attr('title', menuItem.text);
          listNode.find('.lake-dropdown-menu-text').css('background-color', menuItem.value);
        }
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
    titleNode.on('mouseenter', () => {
      titleNode.addClass('lake-dropdown-title-hovered');
    });
    titleNode.on('mouseleave', () => {
      titleNode.removeClass('lake-dropdown-title-hovered');
    });
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
      menuNode.show(item.menuType === 'color' ? 'flex' : 'block');
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
      if (item.menuType === 'color' && currentValues[0]) {
        titleNode.find('.lake-dropdown-icon svg path').css('fill', currentValues[0]);
      }
    });
  }

  public render(target: string | Nodes | NativeNode) {
    this.root = query(target);
    this.config.forEach(name => {
      if (name === '|') {
        this.appendDivider();
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
