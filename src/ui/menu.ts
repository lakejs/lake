import { isKeyHotkey } from 'is-hotkey';
import { query } from '../utils/query';
import { visibleInfo } from '../utils/visible-info';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

export interface MenuConfig<Item> {
  items: Item[];
  onShow?: () => void;
  onHide?: () => void;
}

const emptyCallback = () => {};

// The Menu class represents a list of options for selecting an item.
export abstract class Menu<Item> {

  private horizontalDirection: 'left' | 'right' = 'right';

  private verticalDirection: 'top' | 'bottom' = 'bottom';

  private onShow: () => void;

  private onHide: () => void;

  protected items: Item[];

  protected range: Range | null = null;

  protected noMouseEvent = false;

  public container: Nodes;

  constructor(config: MenuConfig<Item>) {
    this.items = config.items;
    this.onShow = config.onShow || emptyCallback;
    this.onHide = config.onHide || emptyCallback;
    this.container = query('<ul class="lake-popup lake-menu" />');
  }

  protected abstract getItemNode(item: Item): Nodes;

  protected abstract search(keyword: string): Item[];

  private appendItemNode(itemNode: Nodes): void {
    itemNode.on('mouseenter', () => {
      if (this.noMouseEvent) {
        return;
      }
      this.container.find('.lake-menu-item').removeClass('lake-menu-item-selected');
      itemNode.addClass('lake-menu-item-selected');
    });
    itemNode.on('mouseleave', () => {
      if (this.noMouseEvent) {
        return;
      }
      itemNode.removeClass('lake-menu-item-selected');
    });
    this.container.append(itemNode);
  }

  private appendItems(items: Item[]): void {
    this.container.empty();
    for (const item of items) {
      const itemNode = this.getItemNode(item);
      itemNode.addClass('lake-menu-item');
      this.appendItemNode(itemNode);
    }
  }

  private selectFirstItemNodeIfNeeded(): void {
    const selectedItemNode = this.container.find('.lake-menu-item-selected');
    if (selectedItemNode.length === 0) {
      this.container.find('.lake-menu-item').eq(0).addClass('lake-menu-item-selected');
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
    const nativeContainer = this.container.get(0) as HTMLElement;
    const selectedItemNode = this.container.find('.lake-menu-item-selected');
    if (selectedItemNode.length === 0) {
      event.preventDefault();
      const firstItem = this.container.find('.lake-menu-item').eq(0);
      firstItem.addClass('lake-menu-item-selected');
      nativeContainer.scrollTop = 0;
      return;
    }
    this.noMouseEvent = true;
    const paddingTop = Number.parseInt(this.container.computedCSS('padding-top'), 10) || 0;
    const paddingBottom = Number.parseInt(this.container.computedCSS('padding-bottom'), 10) || 0;
    if (isDownKey) {
      event.preventDefault();
      let nextItemNode = selectedItemNode.next();
      if (nextItemNode.length === 0) {
        nextItemNode = this.container.find('.lake-menu-item').eq(0);
      }
      const nextItemNativeNode = nextItemNode.get(0) as HTMLElement;
      const visible = visibleInfo(nextItemNode);
      if (visible.top !== 0 || visible.bottom !== 0) {
        nativeContainer.scrollTop = nextItemNativeNode.offsetTop - this.container.height() + nextItemNode.height() + paddingBottom;
      }
      this.container.find('.lake-menu-item').removeClass('lake-menu-item-selected');
      nextItemNode.addClass('lake-menu-item-selected');
    } else if (isUpKey) {
      event.preventDefault();
      let prevItemNode = selectedItemNode.prev();
      if (prevItemNode.length === 0) {
        const itemNode = this.container.find('.lake-menu-item');
        prevItemNode = itemNode.eq(itemNode.length - 1);
      }
      const prevItemNativeNode = prevItemNode.get(0) as HTMLElement;
      const visible = visibleInfo(prevItemNode);
      if (visible.top !== 0 || visible.bottom !== 0) {
        nativeContainer.scrollTop = prevItemNativeNode.offsetTop - paddingTop;
      }
      this.container.find('.lake-menu-item').removeClass('lake-menu-item-selected');
      prevItemNode.addClass('lake-menu-item-selected');
    } else if (isEnterKey) {
      event.preventDefault();
      selectedItemNode.emit('click');
    }
    window.setTimeout(() => {
      this.noMouseEvent = false;
    }, 50);
  };

  private clickListener: EventListener = event => {
    const targetNode = new Nodes(event.target as Element);
    if (!targetNode.get(0).isConnected) {
      return;
    }
    if (this.container.contains(targetNode)) {
      return;
    }
    this.hide();
  };

  private scrollListener = () => this.updatePosition();

  private resizeListener = () => this.updatePosition();

  private updatePosition(keepDirection = false): void {
    if (!this.range || this.range.isCollapsed) {
      return;
    }
    const visible = visibleInfo(this.range);
    if (visible.bottom !== 0) {
      this.container.css('visibility', 'hidden');
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
      if (rangeRect.y + rangeRect.height + this.container.height() + 5 > window.innerHeight) {
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

  public get visible(): boolean {
    return this.container.get(0).isConnected && this.container.computedCSS('display') !== 'none';
  }

  public update(keyword: string): void {
    const items = this.search(keyword);
    if (items.length === 0) {
      this.hide();
      return;
    }
    this.appendItems(items);
    this.selectFirstItemNodeIfNeeded();
    this.updatePosition(true);
    this.container.css('visibility', '');
  }

  public show(range: Range, keyword?: string): void {
    if (range.isCollapsed) {
      return;
    }
    if (this.items.length === 0) {
      return;
    }
    if (!this.container.get(0).isConnected) {
      query(document.body).append(this.container);
    }
    // append all items for fixing the container's width
    this.appendItems(this.items);
    this.selectFirstItemNodeIfNeeded();
    this.range = range;
    this.container.css('visibility', 'hidden');
    this.container.show();
    (this.container.get(0) as Element).scrollTo(0, 0);
    this.updatePosition();
    // fix the container's width
    this.container.css('width', '');
    this.container.css('width', `${this.container.width() + 10}px`);
    const viewport = range.commonAncestor.closestScroller();
    if (viewport.length > 0) {
      viewport.on('scroll', this.scrollListener);
    } else {
      window.addEventListener('scroll', this.scrollListener);
    }
    document.addEventListener('keydown', this.keydownListener, true);
    document.addEventListener('click', this.clickListener);
    window.addEventListener('resize', this.resizeListener);
    if (keyword) {
      const items = this.search(keyword);
      if (items.length === 0) {
        return;
      }
      this.appendItems(items);
      this.selectFirstItemNodeIfNeeded();
      this.updatePosition(true);
    }
    this.container.css('visibility', '');
    this.onShow();
  }

  public hide(): void {
    if (this.range) {
      const viewport = this.range.commonAncestor.closestScroller();
      if (viewport.length > 0) {
        viewport.off('scroll', this.scrollListener);
      } else {
        window.removeEventListener('scroll', this.scrollListener);
      }
    }
    this.range = null;
    this.container.hide();
    document.removeEventListener('keydown', this.keydownListener, true);
    document.removeEventListener('click', this.clickListener);
    window.removeEventListener('resize', this.resizeListener);
    this.onHide();
  }

  public unmount(): void {
    this.hide();
    this.container.remove();
  }
}
