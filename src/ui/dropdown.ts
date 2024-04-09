import { Base64 } from 'js-base64';
import { NativeNode } from '../types/native';
import { DropdownItem, DropdownMenuItem } from '../types/dropdown';
import { icons } from '../icons';
import { encode } from '../utils/encode';
import { template } from '../utils/template';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';

export type DropdownConfig = DropdownItem & {
  root: Nodes;
  tabIndex?: number;
  onSelect: (value: string) => void;
}

export class Dropdown {
  private config: DropdownConfig;

  private root: Nodes;

  public node: Nodes;

  constructor(config: DropdownConfig) {
    this.config = config;
    this.root = config.root;
    this.node = query(safeTemplate`
      <div class="lake-dropdown lake-${config.menuType}-dropdown" name="${config.name}">
        <button type="button" name="${config.name}" class="lake-dropdown-title">
          <div class="lake-dropdown-${config.icon ? 'icon' : 'text'}"></div>
          <div class="lake-dropdown-down-icon"></div>
        </button>
      </div>
    `);
    if (config.tabIndex !== undefined) {
      const titleNode = this.node.find('.lake-dropdown-title');
      titleNode.attr('tabindex', config.tabIndex.toString());
    }
  }

  // Returns the value of the node.
  public static getValue(node: Nodes): string[] {
    const value = node.attr('value');
    if (value === '') {
      return [];
    }
    return JSON.parse(Base64.decode(value));
  }

  // Updates the value of the node.
  public static setValue(node: Nodes, value: string[]): void {
    node.attr('value', Base64.encode(JSON.stringify(value)));
  }

  public static getMenuMap(menuItems: DropdownMenuItem[]): Map<string, string> {
    const menuMap: Map<string, string> = new Map();
    for (const menuItem of menuItems) {
      // remove HTML tags
      const text = menuItem.text.replace(/<[^>]*>/g, '');
      menuMap.set(menuItem.value, text);
    }
    return menuMap;
  }

  private updateColorAccent(titleNode: Nodes, value: string): void {
    const svgNode = titleNode.find('.lake-dropdown-icon svg').eq(1);
    const lineNode = svgNode.find('line');
    if (lineNode.length > 0) {
      lineNode.attr('stroke', value);
    } else {
      svgNode.find('path').attr('fill', value);
    }
  }

  private apppendMenuItems(menuNode: Nodes): void {
    const config = this.config;
    for (const menuItem of config.menuItems) {
      const listContent = template`
        <li value="${encode(menuItem.value)}">
          <div class="lake-dropdown-menu-text">${menuItem.text}</div>
        </li>
      `;
      const listNode = query(listContent);
      menuNode.append(listNode);
      if (config.menuType === 'color') {
        listNode.attr('title', menuItem.text);
        listNode.find('.lake-dropdown-menu-text').css('background-color', menuItem.value);
      }
      if (menuItem.icon) {
        const menuIconNode = query('<div class="lake-dropdown-menu-icon"></div>');
        menuIconNode.append(menuItem.icon);
        listNode.prepend(menuIconNode);
      }
      const checkIcon = icons.get('check');
      if (checkIcon) {
        const checkNode = query('<div class="lake-dropdown-menu-check"></div>');
        checkNode.append(checkIcon);
        listNode.prepend(checkNode);
      }
    }
  }

  private documentClickListener = (event: Event) => {
    const targetNode = new Nodes(event.target as Element);
    const titleNode = this.node.find('.lake-dropdown-title');
    const menuNode = this.node.find('.lake-dropdown-menu');
    if (targetNode.closest('.lake-dropdown-title').get(0) === titleNode.get(0)) {
      return;
    }
    menuNode.hide();
    document.removeEventListener('click', this.documentClickListener);
  };

  private showMenu(): void {
    const config = this.config;
    const dropdownNode = this.node;
    const menuNode = dropdownNode.find('.lake-dropdown-menu');
    if (dropdownNode.attr('disabled')) {
      return;
    }
    const currentValues = Dropdown.getValue(dropdownNode);
    menuNode.find('.lake-dropdown-menu-check').css('visibility', 'hidden');
    menuNode.find('li').each(node => {
      const listNode = query(node);
      listNode.on('mouseenter', () => {
        if (listNode.hasClass('lake-dropdown-item-selected')) {
          return;
        }
        listNode.addClass('lake-dropdown-item-hovered');
      });
      listNode.on('mouseleave', () => {
        listNode.removeClass('lake-dropdown-item-hovered');
      });
      if (currentValues.indexOf(listNode.attr('value')) >= 0) {
        listNode.find('.lake-dropdown-menu-check').css('visibility', 'visible');
      }
    });
    menuNode.css('visibility', 'hidden');
    menuNode.show(config.menuType === 'color' ? 'flex' : 'block');
    const dropdownNativeNode = dropdownNode.get(0) as HTMLElement;
    const dropdownRect = dropdownNativeNode.getBoundingClientRect();
    if (dropdownRect.x + menuNode.width() + 50 > window.innerWidth) {
      menuNode.css('left', 'auto');
      menuNode.css('right', '0');
    } else {
      menuNode.css('left', '');
      menuNode.css('right', '');
    }
    menuNode.css('visibility', '');
    document.addEventListener('click', this.documentClickListener);
  }

  private bindEvents(): void {
    const config = this.config;
    const dropdownNode = this.node;
    const titleNode = dropdownNode.find('.lake-dropdown-title');
    const textNode = titleNode.find('.lake-dropdown-text');
    const iconNode = titleNode.find('.lake-dropdown-icon');
    const downIconNode = titleNode.find('.lake-dropdown-down-icon');
    const menuNode = dropdownNode.find('.lake-dropdown-menu');
    if (config.menuType === 'color') {
      iconNode.on('mouseenter', () => {
        if (dropdownNode.attr('disabled')) {
          return;
        }
        iconNode.addClass('lake-dropdown-icon-hovered');
      });
      iconNode.on('mouseleave', () => {
        iconNode.removeClass('lake-dropdown-icon-hovered');
      });
      downIconNode.on('mouseenter', () => {
        if (dropdownNode.attr('disabled')) {
          return;
        }
        downIconNode.addClass('lake-dropdown-down-icon-hovered');
      });
      downIconNode.on('mouseleave', () => {
        downIconNode.removeClass('lake-dropdown-down-icon-hovered');
      });
    } else {
      titleNode.on('mouseenter', () => {
        if (dropdownNode.attr('disabled')) {
          return;
        }
        titleNode.addClass('lake-dropdown-title-hovered');
      });
      titleNode.on('mouseleave', () => {
        titleNode.removeClass('lake-dropdown-title-hovered');
      });
    }
    if (config.menuType === 'color') {
      iconNode.on('click', event => {
        event.preventDefault();
        if (dropdownNode.attr('disabled')) {
          return;
        }
        const value = dropdownNode.attr('color') || config.defaultValue;
        config.onSelect(value);
      });
    }
    const triggerNode = (config.menuType === 'color' && downIconNode) ? downIconNode : titleNode;
    triggerNode.on('click', event => {
      event.preventDefault();
      this.showMenu();
    });
    menuNode.on('click', event => {
      event.preventDefault();
      const listItem = query(event.target as NativeNode).closest('li');
      const value = listItem.attr('value');
      Dropdown.setValue(dropdownNode, [value]);
      if (textNode.length > 0) {
        textNode.text(listItem.text());
      }
      if (config.menuType === 'color' && value !== '') {
        dropdownNode.attr('color', value);
        this.updateColorAccent(titleNode, value);
      }
      config.onSelect(value);
      menuNode.hide();
      document.removeEventListener('click', this.documentClickListener);
    });
  }

  public render(): void {
    const config = this.config;
    const dropdownNode = this.node;
    const titleNode = dropdownNode.find('.lake-dropdown-title');
    if (!config.downIcon) {
      titleNode.addClass('lake-dropdown-title-no-down');
    }
    titleNode.css('width', config.width);
    titleNode.attr('title', config.tooltip);
    const textNode = titleNode.find('.lake-dropdown-text');
    const iconNode = titleNode.find('.lake-dropdown-icon');
    if (config.icon) {
      iconNode.append(config.icon);
    }
    if (config.accentIcon) {
      iconNode.append(config.accentIcon);
    }
    const downIconNode = titleNode.find('.lake-dropdown-down-icon');
    if (config.downIcon) {
      downIconNode.append(config.downIcon);
    }
    const menuNode = query('<ul class="lake-dropdown-menu" />');
    menuNode.addClass(`lake-${config.menuType}-dropdown-menu`);
    Dropdown.setValue(dropdownNode, [config.defaultValue]);
    if (textNode.length > 0) {
      const menuMap = Dropdown.getMenuMap(config.menuItems);
      textNode.text(menuMap.get(config.defaultValue) ?? config.defaultValue);
    }
    if (config.menuType === 'color') {
      this.updateColorAccent(titleNode, config.defaultValue);
    }
    this.apppendMenuItems(menuNode);
    dropdownNode.append(titleNode);
    dropdownNode.append(menuNode);
    this.root.append(dropdownNode);
    this.bindEvents();
  }

  public unmount(): void {
    this.node.remove();
    document.removeEventListener('click', this.documentClickListener);
  }
}
