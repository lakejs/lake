import './slash-menu.css';
import { TranslationFunctions } from 'lakelib/i18n/types';
import { template } from 'lakelib/utils/template';
import { query } from 'lakelib/utils/query';
import { Nodes } from 'lakelib/models/nodes';
import { Menu, MenuConfig } from 'lakelib/ui/menu';
import { i18nObject } from 'lakelib/i18n';
import { SlashItem } from './types';
import { slashItems } from './slash-items';

type OnSelect = (
  event: Event,
  item: SlashItem,
  fileNode?: Nodes,
) => void;

interface SlashMenuConfig extends MenuConfig<string | SlashItem> {
  locale?: TranslationFunctions;
  onSelect?: OnSelect;
}

const emptyCallback = () => {};

const slashItemMap = new Map<string, SlashItem>();

for (const item of slashItems) {
  slashItemMap.set(item.name, item);
}

// The SlashMenu class, inheriting from the Menu class, represents a list of commands for executing a command.
export class SlashMenu extends Menu<string | SlashItem> {

  private locale: TranslationFunctions;

  private onSelect: OnSelect;

  constructor(config: SlashMenuConfig) {
    super(config);
    this.locale = config.locale || i18nObject('en-US');
    this.onSelect = config.onSelect || emptyCallback;
    this.container.addClass('lake-slash-menu');
  }

  private getItem(name: string | SlashItem): SlashItem {
    if (typeof name !== 'string') {
      return name;
    }
    const item = slashItemMap.get(name);
    if (!item) {
      throw new Error(`SlashItem "${name}" has not been defined yet.`);
    }
    return item;
  }

  protected getItemNode(name: string | SlashItem): Nodes {
    const item = this.getItem(name);
    const itemTitle = typeof item.title === 'string' ? item.title : item.title(this.locale);
    const itemDescription = typeof item.description === 'string' ? item.description : item.description(this.locale);
    const itemNode = query(template`
      <li name="${item.name}">
        <div class="lake-slash-icon"></div>
        <div class="lake-slash-text">
          <div class="lake-slash-title">${itemTitle}</div>
          <div class="lake-slash-description">${itemDescription}</div>
        </div>
      </li>
    `);
    const icon = item.icon;
    if (icon) {
      itemNode.find('.lake-slash-icon').append(icon);
    }
    if (item.type === 'upload') {
      itemNode.append('<input type="file" />');
      const fileNode = itemNode.find('input[type="file"]');
      const fileNativeNode = fileNode.get(0) as HTMLInputElement;
      if (item.accept) {
        fileNode.attr('accept', item.accept);
      }
      if (item.multiple === true) {
        fileNode.attr('multiple', 'true');
      }
      fileNode.on('click', event => event.stopPropagation());
      fileNode.on('change', event => this.onSelect(event, item, fileNode));
      itemNode.on('click', () => fileNativeNode.click());
    } else {
      itemNode.on('click', event => this.onSelect(event, item));
    }
    return itemNode;
  }

  protected search(keyword: string): (string | SlashItem)[] {
    const localeEnglish = i18nObject('en-US');
    keyword = keyword.toLowerCase();
    const items: (string | SlashItem)[] = [];
    for (const name of this.items) {
      const item = this.getItem(name);
      let itemTitle = typeof item.title === 'string' ? item.title : item.title(this.locale);
      itemTitle = itemTitle.toLowerCase();
      let itemTitleEnglish = typeof item.title === 'string' ? item.title : item.title(localeEnglish);
      itemTitleEnglish = itemTitleEnglish.toLowerCase();
      if (
        itemTitle.indexOf(keyword) >= 0
        || itemTitle.replace(/\s+/g, '').indexOf(keyword) >= 0
        || itemTitleEnglish.indexOf(keyword) >= 0
        || itemTitleEnglish.replace(/\s+/g, '').indexOf(keyword) >= 0
      ) {
        items.push(typeof name === 'string' ? item.name : name);
      }
    }
    return items;
  }
}
