import { isKeyHotkey } from 'is-hotkey';
import type { Editor } from '../editor';
import { SlashItem } from '../types/slash';
import { slashItems } from '../config/slash-items';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { appendBreak } from '../utils/append-break';
import { scrollToNode } from '../utils/scroll-to-node';
import { uploadFile } from '../utils/upload-file';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { i18nObject } from '../../src/i18n';

const slashItemMap: Map<string, SlashItem> = new Map();

for (const item of slashItems) {
  slashItemMap.set(item.name, item);
}

type SlashPopupConfig = {
  editor: Editor;
  items: (string | SlashItem)[];
};

export class SlashPopup {

  private editor: Editor;

  private items: (string | SlashItem)[];

  private root: Nodes;

  private range: Range | null = null;

  private noMouseEvent: boolean = false;

  private keyword: string | null = null;

  public container: Nodes;

  constructor(config: SlashPopupConfig) {
    this.editor = config.editor;
    this.items = config.items;
    this.root = config.editor.popupContainer;
    this.container = query('<ul class="lake-slash-popup" />');
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

  private appendItem(item: SlashItem): void {
    const editor = this.editor;
    const itemTitle = typeof item.title === 'string' ? item.title : item.title(editor.locale);
    const itemDescription = typeof item.description === 'string' ? item.description : item.description(editor.locale);
    const itemNode = query(safeTemplate`
      <li class="lake-slash-item" name="${item.name}">
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
    this.container.append(itemNode);
    itemNode.on('mouseenter', () => {
      if (this.noMouseEvent) {
        return;
      }
      this.container.find('.lake-slash-item').removeClass('lake-slash-item-selected');
      itemNode.addClass('lake-slash-item-selected');
    });
    itemNode.on('mouseleave', () => {
      if (this.noMouseEvent) {
        return;
      }
      itemNode.removeClass('lake-slash-item-selected');
    });
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
            onError: error => editor.config.onMessage('error', error),
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
  }

  private keydownListener = (event: KeyboardEvent) => {
    if (isKeyHotkey('escape', event)) {
      event.preventDefault();
      this.hide();
      return;
    }
    const isDownKey = isKeyHotkey('down', event);
    const isUpKey = isKeyHotkey('up', event);
    const isEnterKey = isKeyHotkey('enter', event);
    if (!isDownKey && !isUpKey && !isEnterKey) {
      return;
    }
    const selectedItemNode = this.container.find('.lake-slash-item-selected');
    if (selectedItemNode.length === 0) {
      const firstItem = this.container.find('.lake-slash-item').eq(0);
      scrollToNode(firstItem, {
        behavior: 'instant',
        block: 'start',
      });
      firstItem.addClass('lake-slash-item-selected');
      return;
    }
    this.noMouseEvent = true;
    if (isDownKey) {
      event.preventDefault();
      let nextItemNode = selectedItemNode.next();
      if (nextItemNode.length === 0) {
        nextItemNode = this.container.find('.lake-slash-item').eq(0);
      }
      scrollToNode(nextItemNode, {
        behavior: 'instant',
        block: 'end',
      });
      this.container.find('.lake-slash-item').removeClass('lake-slash-item-selected');
      nextItemNode.addClass('lake-slash-item-selected');
    } else if (isUpKey) {
      event.preventDefault();
      let prevItemNode = selectedItemNode.prev();
      if (prevItemNode.length === 0) {
        const itemNode = this.container.find('.lake-slash-item');
        prevItemNode = itemNode.eq(itemNode.length - 1);
      }
      scrollToNode(prevItemNode, {
        behavior: 'instant',
        block: 'start',
      });
      this.container.find('.lake-slash-item').removeClass('lake-slash-item-selected');
      prevItemNode.addClass('lake-slash-item-selected');
    } else if (isEnterKey) {
      event.preventDefault();
      selectedItemNode.emit('click');
    }
    window.setTimeout(() => {
      this.noMouseEvent = false;
    }, 50);
  };

  private clickListener = (targetNode: Nodes) => {
    if (this.container.contains(targetNode)) {
      return;
    }
    this.hide();
  };

  private scrollListener = () =>this.position();

  private resizeListener = () =>this.position();

  public get visible(): boolean {
    return this.container.get(0).isConnected && this.container.computedCSS('display') !== 'none';
  }

  public search(keyword: string): string[] {
    const editor = this.editor;
    const localeEnglish = i18nObject('en-US');
    keyword = keyword.toLowerCase();
    const items: string[] = [];
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
        items.push(item.name);
      }
    }
    return items;
  }

  public position(): void {
    if (!this.range) {
      return;
    }
    this.container.css('visibility', '');
    const rangeRect = this.range.get().getBoundingClientRect();
    const rangeX = rangeRect.x + window.scrollX;
    const rangeY = rangeRect.y + window.scrollY;
    // range.x + popup.width > window.width
    if (rangeRect.x + this.container.width() > window.innerWidth) {
      // range.x + window.scrollX - (popup.width - range.width)
      this.container.css('left', `${rangeX - this.container.width() + rangeRect.width}px`);
    } else {
      this.container.css('left', `${rangeX}px`);
    }
    // range.y + range.height + popup.height > window.height
    if (rangeRect.y + rangeRect.height + this.container.height() > window.innerHeight) {
      // range.y + window.scrollY - popup.height
      this.container.css('top', `${rangeY - this.container.height() - 5}px`);
    } else {
      this.container.css('top', `${rangeY + rangeRect.height + 5}px`);
    }
  }

  public render(): void {
    this.root.append(this.container);
    this.update();
  }

  public update(keyword: string | null = null): void {
    if (keyword !== null && this.keyword === keyword) {
      return;
    }
    const items = keyword !== null ? this.search(keyword) : this.items;
    if (items.length === 0) {
      this.hide();
      return;
    }
    this.keyword = keyword;
    this.container.empty();
    for (const name of items) {
      const item = this.getItem(name);
      this.appendItem(item);
    }
    const selectedItemNode = this.container.find('.lake-slash-item-selected');
    if (selectedItemNode.length === 0) {
      this.container.find('.lake-slash-item').eq(0).addClass('lake-slash-item-selected');
    }
  }

  public show(range: Range, keyword?: string): void {
    const editor = this.editor;
    if (this.root.find('.lake-slash-popup').length === 0) {
      this.render();
    } else {
      this.update();
    }
    this.range = range;
    this.container.css('visibility', 'hidden');
    this.container.show();
    this.position();
    // for fixing the container's width
    this.container.css('width', '');
    this.container.css('width', `${this.container.width()}px`);
    if (keyword) {
      this.update(keyword);
    }
    this.container.css('visibility', '');
    document.addEventListener('keydown', this.keydownListener, true);
    editor.event.on('click', this.clickListener);
    editor.event.on('scroll', this.scrollListener);
    editor.event.on('resize', this.resizeListener);
  }

  public hide(): void {
    const editor = this.editor;
    this.range = null;
    this.container.hide();
    document.removeEventListener('keydown', this.keydownListener, true);
    editor.event.off('click', this.clickListener);
    editor.event.off('scroll', this.scrollListener);
    editor.event.off('resize', this.resizeListener);
  }

  public unmount(): void {
    this.hide();
    this.container.remove();
  }
}
