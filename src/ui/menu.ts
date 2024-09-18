import { isKeyHotkey } from 'is-hotkey';
import type { Editor } from '../editor';
import { query } from '../utils/query';
import { scrollToNode } from '../utils/scroll-to-node';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';

export type MenuConfig<Type> = {
  editor: Editor;
  items: Type[];
};

export abstract class Menu<Type> {

  private horizontalDirection: 'left' | 'right' = 'right';

  private verticalDirection: 'top' | 'bottom' = 'bottom';

  protected editor: Editor;

  protected root: Nodes;

  protected items: Type[];

  protected range: Range | null = null;

  protected noMouseEvent: boolean = false;

  protected keyword: string | null = null;

  public container: Nodes;

  constructor(config: MenuConfig<Type>) {
    this.editor = config.editor;
    this.root = config.editor.popupContainer;
    this.items = config.items;
    this.container = query('<ul class="lake-menu-popup" />');
  }

  protected abstract getItemNode(item: Type): Nodes;

  public appendItem(itemNode: Nodes): void {
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

  public abstract search(keyword: string): Type[];

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
      const itemNode = this.getItemNode(item);
      this.appendItem(itemNode);
    }
    const selectedItemNode = this.container.find('.lake-menu-item-selected');
    if (selectedItemNode.length === 0) {
      this.container.find('.lake-menu-item').eq(0).addClass('lake-menu-item-selected');
    }
    this.position(true);
  }

  public show(range: Range, keyword?: string): void {
    const editor = this.editor;
    if (!this.container.get(0).isConnected) {
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
