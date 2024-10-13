import { TranslationFunctions } from '../i18n/types';
import { AppliedItem } from '../types/object';
import { FloatingToolbarButtonItem, FloatingToolbarDropdownItem, FloatingToolbarItem } from '../types/floating-toolbar';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { Button } from './button';
import { Dropdown } from './dropdown';
import { i18nObject } from '../i18n';

type FloatingToolbarPlacement = 'top' | 'bottom';

type FloatingToolbarConfig = {
  range: Range;
  items: FloatingToolbarItem[];
  locale?: TranslationFunctions;
  placement?: FloatingToolbarPlacement;
};

export class FloatingToolbar {

  private range: Range;

  private items: FloatingToolbarItem[];

  private locale: TranslationFunctions;

  private placement: FloatingToolbarPlacement;

  private allMenuMap: Map<string, Map<string, string>> = new Map();

  private buttonItemList: FloatingToolbarButtonItem[] = [];

  private dropdownItemList: FloatingToolbarDropdownItem[] = [];

  private dropdownList: Dropdown[] = [];

  public container: Nodes;

  constructor(config: FloatingToolbarConfig) {
    this.range = config.range;
    this.items = config.items;
    this.locale = config.locale || i18nObject('en-US');
    this.placement = config.placement || 'top';
    this.container = query('<div class="lake-popup lake-floating-toolbar" />');
  }

  private appendDivider(): void {
    this.container.append('<div class="lake-toolbar-divider" />');
  }

  private appendButton(item: FloatingToolbarButtonItem): void {
    const button = new Button({
      root: this.container,
      name: item.name,
      icon: item.icon,
      tooltip: typeof item.tooltip === 'string' ? item.tooltip : item.tooltip(this.locale),
      tabIndex: -1,
      onClick: () => {
        item.onClick(this.range, item.name);
      },
    });
    button.render();
  }

  private appendDropdown(item: FloatingToolbarDropdownItem): void {
    const dropdown = new Dropdown({
      root: this.container,
      locale: this.locale,
      name: item.name,
      icon: item.icon,
      accentIcon: item.accentIcon,
      downIcon: item.downIcon,
      defaultValue: item.defaultValue,
      tooltip: item.tooltip,
      width: item.width,
      menuType: item.menuType,
      menuItems: item.menuItems,
      menuWidth: item.menuWidth,
      menuHeight: item.menuHeight,
      tabIndex: -1,
      direction: this.placement === 'top' ? 'bottom' : 'top',
      onSelect: value => {
        item.onSelect(this.range, value);
      },
    });
    dropdown.render();
    this.dropdownList.push(dropdown);
  }

  private scrollListener = () => this.updatePosition();

  private resizeListener = () => this.updatePosition();

  public updatePosition(): void {
    const rangeRect = this.range.get().getBoundingClientRect();
    this.container.show('flex');
    const rangeX = rangeRect.x + window.scrollX;
    const rangeY = rangeRect.y + window.scrollY;
    const left = (rangeX + rangeRect.width / 2 - this.container.width() / 2).toFixed(1);
    const top = (rangeY - this.container.height() - 6).toFixed(1);
    this.container.css({
      left: `${left}px`,
      top: `${top}px`,
    });
  }

  public updateState(appliedItems: AppliedItem[]) {
    for (const item of this.buttonItemList) {
      const selectedClass = 'lake-button-selected';
      const buttonNode = this.container.find(`button[name="${item.name}"]`);
      const isDisabled = item.isDisabled ? item.isDisabled(appliedItems) : false;
      if (isDisabled) {
        buttonNode.attr('disabled', 'true');
        buttonNode.removeClass(selectedClass);
      } else {
        buttonNode.removeAttr('disabled');
      }
      if (!isDisabled) {
        const isSelected = item.isSelected ? item.isSelected(appliedItems) : false;
        if (isSelected) {
          buttonNode.addClass(selectedClass);
        } else {
          buttonNode.removeClass(selectedClass);
        }
      }
    }
    for (const item of this.dropdownItemList) {
      const selectedValues = item.selectedValues ? item.selectedValues(appliedItems) : [];
      const dropdownNode = this.container.find(`div.lake-dropdown[name="${item.name}"]`);
      const isDisabled = item.isDisabled ? item.isDisabled(appliedItems) : false;
      if (isDisabled) {
        dropdownNode.attr('disabled', 'true');
      } else {
        dropdownNode.removeAttr('disabled');
      }
      if (!isDisabled) {
        Dropdown.setValue(dropdownNode, selectedValues);
        const textNode = dropdownNode.find('.lake-dropdown-text');
        if (textNode.length > 0) {
          const key = selectedValues[0] || item.defaultValue || '';
          const menuMap = this.allMenuMap.get(item.name);
          const text = (menuMap && menuMap.get(key)) ?? key;
          textNode.text(text);
        }
      }
    }
  }

  // Renders a floating toolbar for the specified range.
  public render(): void {
    query(document.body).append(this.container);
    for (const item of this.items) {
      if (item === '|') {
        this.appendDivider();
      } else if (item.type === 'button') {
        this.buttonItemList.push(item);
        this.appendButton(item);
      } else if (item.type === 'dropdown') {
        this.allMenuMap.set(item.name, Dropdown.getMenuMap(item.menuItems, this.locale));
        this.dropdownItemList.push(item);
        this.appendDropdown(item);
      }
    }
    this.updatePosition();
    this.updateState([]);
    const viewport = this.range.commonAncestor.closestScroller();
    if (viewport.length > 0) {
      viewport.on('scroll', this.scrollListener);
    }
    window.addEventListener('resize', this.resizeListener);
  }

  // Destroys the floating toolbar.
  public unmount(): void {
    for (const dropdown of this.dropdownList) {
      dropdown.unmount();
    }
    const viewport = this.range.commonAncestor.closestScroller();
    if (viewport.length > 0) {
      viewport.off('scroll', this.scrollListener);
    }
    window.removeEventListener('resize', this.resizeListener);
    this.container.remove();
  }
}
