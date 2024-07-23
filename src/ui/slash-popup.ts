import { isKeyHotkey } from 'is-hotkey';
import type { Editor } from '../editor';
import { SlashButtonItem, SlashItem } from '../types/slash';
import { slashItems } from '../config/slash-items';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { appendBreak } from '../utils/append-break';
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

  public container: Nodes;

  constructor(config: SlashPopupConfig) {
    this.editor = config.editor;
    this.items = config.items || defaultItems;
    this.root = config.editor.popupContainer;
    this.container = query('<div class="lake-slash-popup" />');
  }

  private getSelectedItemNode(): Nodes {
    let selectedItemNode = this.container.find('.lake-slash-item-selected');
    if (selectedItemNode.length === 0) {
      selectedItemNode = this.container.find('.lake-slash-item').eq(0);
      selectedItemNode.addClass('lake-slash-item-selected');
    }
    return selectedItemNode;
  }

  private selectItemNode(itemNode: Nodes): void {
    (itemNode.get(0) as HTMLElement).scrollIntoView({
      behavior: 'instant',
      block: 'center',
    });
    this.container.find('.lake-slash-item').removeClass('lake-slash-item-selected');
    itemNode.addClass('lake-slash-item-selected');
  }

  private appendButton(item: SlashButtonItem): void {
    const editor = this.editor;
    const itemNode = query(safeTemplate`
      <div class="lake-slash-item" name="${item.name}">
        <div class="lake-slash-icon"></div>
        <div class="lake-slash-text">
          <div class="lake-slash-title">${item.title}</div>
          <div class="lake-slash-description">${item.description}</div>
        </div>
      </div>
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
      const prevNode = range.getPrevNode();
      const block = prevNode.closestBlock();
      prevNode.remove();
      appendBreak(block);
      item.onClick(editor, item.name);
      this.hide();
    });
  }

  private documentKeydownListener = (event: KeyboardEvent) => {
    this.noMouseEvent = true;
    const selectedItemNode = this.getSelectedItemNode();
    if (isKeyHotkey('down', event)) {
      event.preventDefault();
      let nextItemNode = selectedItemNode.next();
      if (nextItemNode.length === 0) {
        nextItemNode = this.container.find('.lake-slash-item').eq(0);
      }
      this.selectItemNode(nextItemNode);
    } else if (isKeyHotkey('up', event)) {
      event.preventDefault();
      let prevItemNode = selectedItemNode.prev();
      if (prevItemNode.length === 0) {
        const itemNode = this.container.find('.lake-slash-item');
        prevItemNode = itemNode.eq(itemNode.length - 1);
      }
      this.selectItemNode(prevItemNode);
    } else if (isKeyHotkey('enter', event)) {
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
    return this.container.computedCSS('display') !== 'none';
  }

  public updatePosition(): void {
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
      this.container.css('top', `${rangeY - this.container.height()}px`);
    } else {
      this.container.css('top', `${rangeY + rangeRect.height}px`);
    }
  }

  public render(): void {
    this.root.append(this.container);
    for (const name of this.items) {
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
    this.getSelectedItemNode();
  }

  public show(range: Range): void {
    if (this.root.find('.lake-slash-popup').length === 0) {
      this.render();
    }
    this.range = range;
    this.container.css('visibility', 'hidden');
    this.container.show();
    this.updatePosition();
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
