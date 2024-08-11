import { isKeyHotkey } from 'is-hotkey';
import type { Editor } from '../editor';
import { SlashButtonItem, SlashItem } from '../types/slash';
import { slashItems } from '../config/slash-items';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { appendBreak } from '../utils/append-break';
import { scrollToNode } from '../utils/scroll-to-node';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { icons } from '../icons';

const slashItemMap: Map<string, SlashItem> = new Map();

for (const item of slashItems) {
  slashItemMap.set(item.name, item);
}

const defaultItems: string[] = [
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'paragraph',
  'blockQuote',
  'numberedList',
  'bulletedList',
  'checklist',
  'hr',
  'codeBlock',
  'video',
  'equation',
];

type SlashPopupConfig = {
  editor: Editor;
  items?: (string | SlashItem)[];
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
    this.items = config.items || defaultItems;
    this.root = config.editor.popupContainer;
    this.container = query('<ul class="lake-slash-popup" />');
  }

  private appendButton(item: SlashButtonItem): void {
    const editor = this.editor;
    const itemNode = query(safeTemplate`
      <li class="lake-slash-item" name="${item.name}">
        <div class="lake-slash-icon"></div>
        <div class="lake-slash-text">
          <div class="lake-slash-title">${item.title}</div>
          <div class="lake-slash-description">${item.description}</div>
        </div>
      </li>
    `);
    const icon = icons.get(item.name);
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
    itemNode.on('click', () => {
      editor.focus();
      const range = editor.selection.range;
      const block = range.commonAncestor.closestBlock();
      block.empty();
      appendBreak(block);
      item.onClick(editor, item.name);
      this.hide();
    });
  }

  private documentKeydownListener = (event: KeyboardEvent) => {
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

  private documentClickListener = (event: Event) => {
    const targetNode = new Nodes(event.target as Element);
    if (this.container.contains(targetNode)) {
      return;
    }
    this.hide();
  };

  public get visible(): boolean {
    return this.container.get(0).isConnected && this.container.computedCSS('display') !== 'none';
  }

  public search(keyword: string): string[] {
    keyword = keyword.toLowerCase();
    const items: string[] = [];
    for (const item of slashItems) {
      if (typeof item.title === 'string') {
        if (
          item.title.toLowerCase().indexOf(keyword) >= 0 ||
          item.title.toLowerCase().replace(/\s+/g, '').indexOf(keyword) >= 0
        ) {
          items.push(item.name);
        }
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
      let item;
      if (typeof name === 'string') {
        item = slashItemMap.get(name);
        if (!item) {
          throw new Error(`SlashItem "${name}" has not been defined yet.`);
        }
      } else {
        item = name;
      }
      if (item.type === 'button') {
        this.appendButton(item);
      } else if (item.type === 'upload') {
        // this.appendUpload(item);
      }
    }
    const selectedItemNode = this.container.find('.lake-slash-item-selected');
    if (selectedItemNode.length === 0) {
      this.container.find('.lake-slash-item').eq(0).addClass('lake-slash-item-selected');
    }
  }

  public show(range: Range, keyword?: string): void {
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
    document.addEventListener('keydown', this.documentKeydownListener, true);
    document.addEventListener('click', this.documentClickListener);
  }

  public hide(): void {
    this.range = null;
    this.container.hide();
    document.removeEventListener('keydown', this.documentKeydownListener, true);
    document.removeEventListener('click', this.documentClickListener);
  }

  public unmount(): void {
    this.hide();
    this.container.remove();
  }
}
