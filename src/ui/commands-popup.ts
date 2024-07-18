import { isKeyHotkey } from 'is-hotkey';
import type { Editor } from '../editor';
import { TranslationFunctions } from '../i18n/types';
import { CommandButtonItem, CommandItem } from '../types/commands';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Range } from '../models/range';
import { icons } from '../icons';

const commandItems: CommandItem[] = [
  {
    name: 'codeBlock',
    type: 'button',
    icon: icons.get('codeBlock'),
    title: 'Code block',
    description: 'Insert a code block.',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
  {
    name: 'equation',
    type: 'button',
    icon: icons.get('equation'),
    title: 'Equation',
    description: 'Insert TeX expression in text.',
    onClick: (editor, value) => {
      editor.command.execute(value);
    },
  },
];

const commandItemMap: Map<string, CommandItem> = new Map();

for (const item of commandItems) {
  commandItemMap.set(item.name, item);
}

const defaultItems: string[] = [
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
  'codeBlock',
  'equation',
];

type CommandsPopupConfig = {
  editor: Editor;
  locale?: TranslationFunctions;
  items?: (string | CommandItem)[];
};

export class CommandsPopup {

  private editor: Editor;

  private items: (string | CommandItem)[];

  private root: Nodes;

  private range: Range | null = null;

  private noMouseEvent: boolean = false;

  public container: Nodes;

  constructor(config: CommandsPopupConfig) {
    this.editor = config.editor;
    this.items = config.items || defaultItems;
    this.root = config.editor.popupContainer;
    this.container = query('<div class="lake-commands-popup" />');
  }

  private getSelectedItemNode(): Nodes {
    let selectedItemNode = this.container.find('.lake-commands-item-selected');
    if (selectedItemNode.length === 0) {
      selectedItemNode = this.container.find('.lake-commands-item').eq(0);
      selectedItemNode.addClass('lake-commands-item-selected');
    }
    return selectedItemNode;
  }

  private selectItemNode(itemNode: Nodes): void {
    (itemNode.get(0) as HTMLElement).scrollIntoView({
      behavior: 'instant',
      block: 'center',
    });
    this.container.find('.lake-commands-item').removeClass('lake-commands-item-selected');
    itemNode.addClass('lake-commands-item-selected');
  }

  private appendButton(item: CommandButtonItem): void {
    const itemNode = query(safeTemplate`
      <div class="lake-commands-item" name="${item.name}">
        <div class="lake-commands-icon"></div>
        <div class="lake-commands-text">
          <div class="lake-commands-title">${item.title}</div>
          <div class="lake-commands-description">${item.description}</div>
        </div>
      </div>
    `);
    const icon = icons.get(item.name);
    if (icon) {
      itemNode.find('.lake-commands-icon').append(icon);
    }
    this.container.append(itemNode);
    itemNode.on('mouseenter', () => {
      if (this.noMouseEvent) {
        return;
      }
      this.container.find('.lake-commands-item').removeClass('lake-commands-item-selected');
      itemNode.addClass('lake-commands-item-selected');
    });
    itemNode.on('mouseleave', () => {
      itemNode.removeClass('lake-commands-item-selected');
    });
    itemNode.on('click', () => {
      this.editor.focus();
      item.onClick(this.editor, item.name);
      this.hide();
    });
  }

  private documentKeydownListener = (event: KeyboardEvent) => {
    this.noMouseEvent = true;
    const selectedItemNode = this.getSelectedItemNode();
    if (isKeyHotkey('down', event)) {
      let nextItemNode = selectedItemNode.next();
      if (nextItemNode.length === 0) {
        nextItemNode = this.container.find('.lake-commands-item').eq(0);
      }
      this.selectItemNode(nextItemNode);
    } else if (isKeyHotkey('up', event)) {
      let prevItemNode = selectedItemNode.prev();
      if (prevItemNode.length === 0) {
        const itemNode = this.container.find('.lake-commands-item');
        prevItemNode = itemNode.eq(itemNode.length - 1);
      }
      this.selectItemNode(prevItemNode);
    } else if (isKeyHotkey('enter', event)) {
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
        item = commandItemMap.get(name);
        if (!item) {
          throw new Error(`CommandItem "${name}" has not been defined yet.`);
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
    if (this.root.find('.lake-commands-popup').length === 0) {
      this.render();
    }
    this.range = range;
    this.container.css('visibility', 'hidden');
    this.container.show();
    this.updatePosition();
    this.container.css('visibility', '');
    document.addEventListener('keydown', this.documentKeydownListener);
    document.addEventListener('click', this.documentClickListener);
  }

  public hide(): void {
    this.range = null;
    this.container.hide();
    document.removeEventListener('keydown', this.documentKeydownListener);
    document.removeEventListener('click', this.documentClickListener);
  }

  public unmount(): void {
    this.hide();
    this.container.remove();
  }
}
