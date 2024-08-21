import { TranslationFunctions } from '../i18n/types';
import { DropdownItem, DropdownMenuItem } from '../types/dropdown';
import { icons } from '../icons';
import { encode } from '../utils/encode';
import { toBase64 } from '../utils/to-base64';
import { fromBase64 } from '../utils/from-base64';
import { template } from '../utils/template';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { i18nObject } from '../../src/i18n';

type DropdownConfig = DropdownItem & {
  root: Nodes;
  locale?: TranslationFunctions;
  tabIndex?: number;
  placement?: 'top' | 'bottom';
  onSelect: (value: string) => void;
}

export class Dropdown {
  private config: DropdownConfig;

  private root: Nodes;

  private locale: TranslationFunctions;

  public node: Nodes;

  constructor(config: DropdownConfig) {
    this.config = config;
    this.root = config.root;
    this.locale = config.locale || i18nObject('en-US');
    const placement = config.placement || 'bottom';
    this.node = query(safeTemplate`
      <div class="lake-dropdown lake-${config.menuType}-dropdown" name="${config.name}" placement="${placement}">
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
    return JSON.parse(fromBase64(value));
  }

  // Updates the value of the node.
  public static setValue(node: Nodes, value: string[]): void {
    node.attr('value', toBase64(JSON.stringify(value)));
  }

  public static getMenuMap(menuItems: DropdownMenuItem[], locale: TranslationFunctions): Map<string, string> {
    const menuMap: Map<string, string> = new Map();
    for (const menuItem of menuItems) {
      // remove HTML tags
      let text = typeof menuItem.text === 'string' ? menuItem.text : menuItem.text(locale);
      text = text.replace(/<[^>]*>/g, '');
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
      const menuText = typeof menuItem.text === 'string' ? menuItem.text : menuItem.text(this.locale);
      const listContent = template`
        <li value="${encode(menuItem.value)}">
          <div class="lake-dropdown-menu-text">${menuText}</div>
        </li>
      `;
      const listNode = query(listContent);
      menuNode.append(listNode);
      if (config.menuType === 'character') {
        listNode.attr('title', menuText);
        listNode.find('.lake-dropdown-menu-text').text(menuItem.value);
      } else if (config.menuType === 'color') {
        listNode.attr('title', menuText);
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
    if (targetNode.closest('.lake-dropdown-title').get(0) === titleNode.get(0)) {
      return;
    }
    this.hideMenu();
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
    menuNode.show(config.menuType === 'list' ? 'block' : 'flex');
    const dropdownNativeNode = dropdownNode.get(0) as HTMLElement;
    const dropdownRect = dropdownNativeNode.getBoundingClientRect();
    // A overflow width on the left side, greater than 0 indicates an overflow.
    const leftOverflow = menuNode.width() - (dropdownRect.x + dropdownRect.width);
    // A overflow width on the right side, greater than 0 indicates an overflow.
    const rightOverflow = dropdownRect.x + menuNode.width() - window.innerWidth;
    if (rightOverflow + 50 > 0 && (leftOverflow < 0 || leftOverflow < rightOverflow)) {
      menuNode.css('left', 'auto');
      menuNode.css('right', '0');
    } else {
      menuNode.css('left', '');
      menuNode.css('right', '');
    }
    menuNode.css('visibility', '');
    document.addEventListener('click', this.documentClickListener);
  }

  private hideMenu(): void {
    const dropdownNode = this.node;
    const menuNode = dropdownNode.find('.lake-dropdown-menu');
    menuNode.hide();
    document.removeEventListener('click', this.documentClickListener);
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
        const value = dropdownNode.attr('color') || config.defaultValue || '';
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
      event.stopPropagation();
      const listItem = query(event.target as Node).closest('li');
      if (listItem.length === 0) {
        return;
      }
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
      this.hideMenu();
    });
  }

  public render(): void {
    const config = this.config;
    const defaultValue = config.defaultValue ?? '';
    const dropdownNode = this.node;
    const titleNode = dropdownNode.find('.lake-dropdown-title');
    if (!config.downIcon) {
      titleNode.addClass('lake-dropdown-title-no-down');
    }
    if (config.width) {
      titleNode.css('width', config.width);
    }
    const tooltip = typeof config.tooltip === 'string' ? config.tooltip : config.tooltip(this.locale);
    titleNode.attr('title', tooltip);
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
    if (config.menuWidth) {
      menuNode.css('width', config.menuWidth);
    }
    if (config.menuHeight) {
      menuNode.addClass('lake-dropdown-menu-with-scroll');
      menuNode.css('height', config.menuHeight);
    }
    Dropdown.setValue(dropdownNode, [defaultValue]);
    if (textNode.length > 0) {
      const menuMap = Dropdown.getMenuMap(config.menuItems, this.locale);
      textNode.text(menuMap.get(defaultValue) ?? defaultValue);
    }
    if (config.menuType === 'color') {
      this.updateColorAccent(titleNode, defaultValue);
    }
    this.apppendMenuItems(menuNode);
    dropdownNode.append(titleNode);
    dropdownNode.append(menuNode);
    this.root.append(dropdownNode);
    this.bindEvents();
  }

  public unmount(): void {
    this.hideMenu();
    this.node.remove();
  }
}
