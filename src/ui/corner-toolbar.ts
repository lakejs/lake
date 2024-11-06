import { TranslationFunctions } from '../i18n/types';
import { CornerToolbarItem } from '../types/corner-toolbar';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { i18nObject } from '../i18n';

type CornerToolbarConfig = {
  locale?: TranslationFunctions;
  root: Nodes;
  items: CornerToolbarItem[];
}

// The CornerToolbar class represents a button group located in the top-right corner of a box.
export class CornerToolbar {
  private config: CornerToolbarConfig;

  private locale: TranslationFunctions;

  private root: Nodes;

  public container: Nodes;

  constructor(config: CornerToolbarConfig) {
    this.config = config;
    this.locale = this.config.locale || i18nObject('en-US');
    this.root = config.root;
    this.container = query('<div class="lake-corner-toolbar" />');
  }

  private appendButton(item: CornerToolbarItem): void {
    const buttonNode = query(safeTemplate`
      <button type="button" name="${item.name}" tabindex="-1" />
    `);
    const tooltip = typeof item.tooltip === 'string' ? item.tooltip : item.tooltip(this.locale);
    buttonNode.attr('title', tooltip);
    if (item.icon) {
      buttonNode.append(item.icon);
    }
    this.container.append(buttonNode);
    buttonNode.on('click', event => {
      event.preventDefault();
      item.onClick(event);
    });
  }

  public render(): void {
    const { items } = this.config;
    if (items.length === 0) {
      return;
    }
    this.root.append(this.container);
    for (const item of items) {
      this.appendButton(item);
    }
  }
}
