import { SlashItem } from '../types/slash';
import { slashItems } from '../config/slash-items';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { appendBreak } from '../utils/append-break';
import { uploadFile } from '../utils/upload-file';
import { Nodes } from '../models/nodes';
import { Menu, MenuConfig } from './menu';
import { i18nObject } from '../i18n';

const slashItemMap: Map<string, SlashItem> = new Map();

for (const item of slashItems) {
  slashItemMap.set(item.name, item);
}

export class SlashMenu extends Menu<string | SlashItem> {

  constructor(config: MenuConfig<string | SlashItem>) {
    super(config);
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

  private emptyBlock(): void {
    const range = this.editor.selection.range;
    const block = range.commonAncestor.closestBlock();
    this.hide();
    block.empty();
    appendBreak(block);
    range.shrinkBefore(block);
  }

  protected getItemNode(name: string | SlashItem): Nodes {
    const editor = this.editor;
    const item = this.getItem(name);
    const itemTitle = typeof item.title === 'string' ? item.title : item.title(editor.locale);
    const itemDescription = typeof item.description === 'string' ? item.description : item.description(editor.locale);
    const itemNode = query(safeTemplate`
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
      fileNode.on('change', event => {
        editor.focus();
        this.emptyBlock();
        const target = event.target as HTMLInputElement;
        const files = target.files || [];
        for (const file of files) {
          uploadFile({
            editor,
            name: item.name,
            file,
            onError: error => {
              fileNativeNode.value = '';
              editor.config.onMessage('error', error);
            },
            onSuccess: () => {
              fileNativeNode.value = '';
            },
          });
        }
      });
      itemNode.on('click', () => {
        fileNativeNode.click();
      });
    } else {
      itemNode.on('click', () => {
        editor.focus();
        this.emptyBlock();
        item.onClick(editor, item.name);
      });
    }
    return itemNode;
  }

  protected search(keyword: string): (string | SlashItem)[] {
    const editor = this.editor;
    const localeEnglish = i18nObject('en-US');
    keyword = keyword.toLowerCase();
    const items: (string | SlashItem)[] = [];
    for (const name of this.items) {
      const item = this.getItem(name);
      let itemTitle = typeof item.title === 'string' ? item.title : item.title(editor.locale);
      itemTitle = itemTitle.toLowerCase();
      let itemTitleEnglish = typeof item.title === 'string' ? item.title : item.title(localeEnglish);
      itemTitleEnglish = itemTitleEnglish.toLowerCase();
      if (
        itemTitle.indexOf(keyword) >= 0 ||
        itemTitle.replace(/\s+/g, '').indexOf(keyword) >= 0 ||
        itemTitleEnglish.indexOf(keyword) >= 0 ||
        itemTitleEnglish.replace(/\s+/g, '').indexOf(keyword) >= 0
      ) {
        items.push(typeof name === 'string' ? item.name : name);
      }
    }
    return items;
  }
}
