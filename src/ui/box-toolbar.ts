import { TranslationFunctions } from '../i18n/types';
import {
  BoxToolbarButtonItem, BoxToolbarDropdownItem,
  BoxToolbarItem, BoxToolbarPlacement,
} from '../types/box-toolbar';
import { query } from '../utils/query';
import { nodePosition } from '../utils/node-position';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';
import { Button } from './button';
import { Dropdown } from './dropdown';
import { i18nObject } from '../i18n';

type BoxToolbarConfig = {
  box: Box;
  items: ('|' | BoxToolbarItem)[];
  locale?: TranslationFunctions;
  placement?: BoxToolbarPlacement;
};

export class BoxToolbar {

  private box: Box;

  private items: ('|' | BoxToolbarItem)[];

  private locale: TranslationFunctions;

  private placement: BoxToolbarPlacement;

  private buttonItemList: BoxToolbarButtonItem[] = [];

  private dropdownItemList: BoxToolbarDropdownItem[] = [];

  private dropdownList: Dropdown[] = [];

  public container: Nodes;

  constructor(config: BoxToolbarConfig) {
    this.box = config.box;
    this.items = config.items;
    this.locale = config.locale || i18nObject('en-US');
    this.placement = config.placement || 'top';
    this.container = query('<div class="lake-box-toolbar lake-custom-properties" />');
  }

  private appendDivider(): void {
    this.container.append('<div class="lake-toolbar-divider" />');
  }

  private appendButton(item: BoxToolbarButtonItem): void {
    const button = new Button({
      root: this.container,
      name: item.name,
      icon: item.icon,
      tooltip: typeof item.tooltip === 'string' ? item.tooltip : item.tooltip(this.locale),
      tabIndex: -1,
      onClick: () => {
        item.onClick(this.box, item.name);
      },
    });
    button.render();
  }

  private appendDropdown(item: BoxToolbarDropdownItem): void {
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
      tabIndex: -1,
      direction: this.placement === 'top' ? 'bottom' : 'top',
      onSelect: value => {
        item.onSelect(this.box, value);
      },
    });
    dropdown.render();
    this.dropdownList.push(dropdown);
  }

  private scrollListener = () => this.updatePosition();

  private resizeListener = () => this.updatePosition();

  public updatePosition(): void {
    const boxNode = this.box.node;
    const boxNativeNode = boxNode.get(0) as HTMLElement;
    const boxRect = boxNativeNode.getBoundingClientRect();
    const position = nodePosition(boxNode);
    if (position.top < 0 || position.bottom + boxRect.height < 0) {
      this.container.hide();
      return;
    }
    this.container.show('flex');
    const boxX = boxRect.x + window.scrollX;
    const boxY = boxRect.y + window.scrollY;
    const left = (boxX + boxRect.width / 2 - this.container.width() / 2).toFixed(1);
    const top = (boxY - this.container.height() - 6).toFixed(1);
    this.container.css({
      left: `${left}px`,
      top: `${top}px`,
    });
  }

  // Renders a toolbar for the specified box.
  public render(): void {
    query(document.body).append(this.container);
    for (const item of this.items) {
      if (item === '|') {
        this.appendDivider();
      } else if (item.type === 'button') {
        this.buttonItemList.push(item);
        this.appendButton(item);
      } else if (item.type === 'dropdown') {
        this.dropdownItemList.push(item);
        this.appendDropdown(item);
      }
    }
    this.updatePosition();
    const viewport = this.box.node.closestScroller();
    if (viewport.length > 0) {
      viewport.on('scroll', this.scrollListener);
    }
    window.addEventListener('resize', this.resizeListener);
  }

  // Destroys the toolbar.
  public unmount(): void {
    for (const dropdown of this.dropdownList) {
      dropdown.unmount();
    }
    const viewport = this.box.node.closestScroller();
    if (viewport.length > 0) {
      viewport.off('scroll', this.scrollListener);
    }
    window.removeEventListener('resize', this.resizeListener);
    this.container.remove();
  }
}
