import { isKeyHotkey } from 'is-hotkey';
import { MentionItem } from '../types/mention';
import type { Editor } from '../editor';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { scrollToNode } from '../utils/scroll-to-node';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

type MentionPopupConfig = {
  editor: Editor;
  items: MentionItem[];
};

export function getTargetRange(range: Range): Range | null {
  const targetRange = range.clone();
  targetRange.shrink();
  if (targetRange.startNode.isElement) {
    if (targetRange.startOffset === 0) {
      return null;
    }
    const textNode = targetRange.startNode.children()[targetRange.startOffset - 1];
    targetRange.setEnd(textNode, targetRange.startNode.text().length);
    targetRange.collapseToEnd();
  }
  const textNode = targetRange.startNode;
  const text = textNode.text();
  const lastIndexOfNormalSpaceAt = text.lastIndexOf(' @');
  const lastIndexOfNoBreakSpaceAt = text.lastIndexOf('\xA0@');
  if (text.indexOf('@') === 0) {
    targetRange.setStart(textNode, 0);
  } else if (lastIndexOfNormalSpaceAt >= 0) {
    targetRange.setStart(textNode, lastIndexOfNormalSpaceAt + 1);
  } else if (lastIndexOfNoBreakSpaceAt >= 0) {
    targetRange.setStart(textNode, lastIndexOfNoBreakSpaceAt + 1);
  } else {
    return null;
  }
  return targetRange;
}

export class MentionPopup {

  private editor: Editor;

  private items: MentionItem[];

  private root: Nodes;

  private range: Range | null = null;

  private noMouseEvent: boolean = false;

  private keyword: string | null = null;

  private horizontalDirection: 'left' | 'right' = 'right';

  private verticalDirection: 'top' | 'bottom' = 'bottom';

  public container: Nodes;

  constructor(config: MentionPopupConfig) {
    this.editor = config.editor;
    this.items = config.items;
    this.root = config.editor.popupContainer;
    this.container = query('<ul class="lake-mention-popup" />');
  }

  private appendItem(item: MentionItem): void {
    const editor = this.editor;
    const itemNode = query(safeTemplate`
      <li class="lake-mention-item" item-id="${item.id}">
        <div class="lake-mention-avatar"></div>
        <div class="lake-mention-nickname">${item.nickname ?? item.name}</div>
        <div class="lake-mention-name">(${item.name})</div>
      </li>
    `);
    const avatarNode = itemNode.find('.lake-mention-avatar');
    if (item.avatar) {
      avatarNode.append(item.avatar);
    } else {
      avatarNode.remove();
    }
    if (!item.nickname) {
      itemNode.find('.lake-mention-name').remove();
    }
    this.container.append(itemNode);
    itemNode.on('mouseenter', () => {
      if (this.noMouseEvent) {
        return;
      }
      this.container.find('.lake-mention-item').removeClass('lake-mention-item-selected');
      itemNode.addClass('lake-mention-item-selected');
    });
    itemNode.on('mouseleave', () => {
      if (this.noMouseEvent) {
        return;
      }
      itemNode.removeClass('lake-mention-item-selected');
    });
    itemNode.on('click', () => {
      this.hide();
      editor.focus();
      const targetRange = getTargetRange(editor.selection.range);
      if (targetRange) {
        targetRange.get().deleteContents();
      }
      editor.selection.insertBox('mention', item);
      editor.history.save();
    });
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
    const selectedItemNode = this.container.find('.lake-mention-item-selected');
    if (selectedItemNode.length === 0) {
      const firstItem = this.container.find('.lake-mention-item').eq(0);
      scrollToNode(firstItem, {
        behavior: 'instant',
        block: 'start',
      });
      firstItem.addClass('lake-mention-item-selected');
      return;
    }
    this.noMouseEvent = true;
    if (isDownKey) {
      event.preventDefault();
      let nextItemNode = selectedItemNode.next();
      if (nextItemNode.length === 0) {
        nextItemNode = this.container.find('.lake-mention-item').eq(0);
      }
      scrollToNode(nextItemNode, {
        behavior: 'instant',
        block: 'end',
      });
      this.container.find('.lake-mention-item').removeClass('lake-mention-item-selected');
      nextItemNode.addClass('lake-mention-item-selected');
    } else if (isUpKey) {
      event.preventDefault();
      let prevItemNode = selectedItemNode.prev();
      if (prevItemNode.length === 0) {
        const itemNode = this.container.find('.lake-mention-item');
        prevItemNode = itemNode.eq(itemNode.length - 1);
      }
      scrollToNode(prevItemNode, {
        behavior: 'instant',
        block: 'start',
      });
      this.container.find('.lake-mention-item').removeClass('lake-mention-item-selected');
      prevItemNode.addClass('lake-mention-item-selected');
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

  public search(keyword: string): MentionItem[] {
    keyword = keyword.toLowerCase();
    const items: MentionItem[] = [];
    for (const item of this.items) {
      const nickname = item.nickname ?? item.name;
      if (
        item.name.toLowerCase().indexOf(keyword) >= 0 ||
        nickname.toLowerCase().indexOf(keyword) >= 0 ||
        nickname.replace(/\s+/g, '').indexOf(keyword) >= 0
      ) {
        items.push(item);
      }
    }
    return items;
  }

  public position(keepDirection: boolean = false): void {
    if (!this.range) {
      return;
    }
    this.container.css('visibility', '');
    const rangeRect = this.range.get().getBoundingClientRect();
    const rangeX = rangeRect.x + window.scrollX;
    const rangeY = rangeRect.y + window.scrollY;
    if (!keepDirection) {
      if (rangeRect.x + this.container.width() > window.innerWidth) {
        this.horizontalDirection = 'left';
      } else {
        this.horizontalDirection = 'right';
      }
      if (rangeRect.y + rangeRect.height + this.container.height() > window.innerHeight) {
        this.verticalDirection = 'top';
      } else {
        this.verticalDirection = 'bottom';
      }
    }
    if (this.horizontalDirection === 'left') {
      this.container.css('left', `${rangeX - this.container.width() + rangeRect.width}px`);
    } else {
      this.container.css('left', `${rangeX}px`);
    }
    if (this.verticalDirection === 'top') {
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
    for (const item of items) {
      this.appendItem(item);
    }
    const selectedItemNode = this.container.find('.lake-mention-item-selected');
    if (selectedItemNode.length === 0) {
      this.container.find('.lake-mention-item').eq(0).addClass('lake-mention-item-selected');
    }
    this.position(true);
  }

  public show(range: Range, keyword?: string): void {
    const editor = this.editor;
    if (this.root.find('.lake-mention-popup').length === 0) {
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
