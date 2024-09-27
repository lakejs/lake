import { isKeyHotkey } from 'is-hotkey';
import { query } from '../utils/query';
import { scrollToNode } from '../utils/scroll-to-node';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

export type MenuConfig<Item> = {
  root: Nodes;
  items: Item[];
};

export abstract class Menu<Item> {

  private horizontalDirection: 'left' | 'right' = 'right';

  private verticalDirection: 'top' | 'bottom' = 'bottom';

  protected root: Nodes;

  protected items: Item[];

  protected range: Range | null = null;

  protected noMouseEvent: boolean = false;

  public container: Nodes;

  constructor(config: MenuConfig<Item>) {
    this.root = config.root;
    this.items = config.items;
    this.container = query('<ul class="lake-menu" />');
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
    const selectedItemNode = this.container.find('.lake-menu-item-selected');
    if (selectedItemNode.length === 0) {
      const firstItem = this.container.find('.lake-menu-item').eq(0);
      scrollToNode(firstItem, {
        behavior: 'instant',
        block: 'start',
      });
      firstItem.addClass('lake-menu-item-selected');
      return;
    }
    this.noMouseEvent = true;
    if (isDownKey) {
      event.preventDefault();
      let nextItemNode = selectedItemNode.next();
      if (nextItemNode.length === 0) {
        nextItemNode = this.container.find('.lake-menu-item').eq(0);
      }
      scrollToNode(nextItemNode, {
        behavior: 'instant',
        block: 'end',
      });
      this.container.find('.lake-menu-item').removeClass('lake-menu-item-selected');
      nextItemNode.addClass('lake-menu-item-selected');
    } else if (isUpKey) {
      event.preventDefault();
      let prevItemNode = selectedItemNode.prev();
      if (prevItemNode.length === 0) {
        const itemNode = this.container.find('.lake-menu-item');
        prevItemNode = itemNode.eq(itemNode.length - 1);
      }
      scrollToNode(prevItemNode, {
        behavior: 'instant',
        block: 'start',
      });
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

  private updatePosition(keepDirection: boolean = false): void {
    if (!this.range || this.range.isCollapsed) {
      return;
    }
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
      this.root.append(this.container);
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
    this.container.css('width', `${this.container.width()}px`);
    const viewport = range.commonAncestor.closestScroller();
    if (viewport.length > 0) {
      viewport.on('scroll', this.scrollListener);
    }
    document.addEventListener('keydown', this.keydownListener, true);
    document.addEventListener('click', this.clickListener);
    window.addEventListener('resize', this.resizeListener);
    if (keyword) {
      this.update(keyword);
    } else {
      this.container.css('visibility', '');
    }
  }

  public hide(): void {
    if (this.range) {
      const viewport = this.range.commonAncestor.closestScroller();
      if (viewport.length > 0) {
        viewport.off('scroll', this.scrollListener);
      }
    }
    this.range = null;
    this.container.hide();
    document.removeEventListener('keydown', this.keydownListener, true);
    document.removeEventListener('click', this.clickListener);
    window.removeEventListener('resize', this.resizeListener);
  }

  public unmount(): void {
    this.hide();
    this.container.remove();
  }
}
