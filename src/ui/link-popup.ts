import { isKeyHotkey } from 'is-hotkey';
import { TranslationFunctions } from '../i18n/types';
import { icons } from '../icons';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { nodePosition } from '../utils/node-position';
import { Nodes } from '../models/nodes';
import { Button } from './button';
import { i18nObject } from '../../src/i18n';

type LinkPopupConfig = {
  root: Nodes;
  locale?: TranslationFunctions;
  onCopy?: (error: boolean) => void;
  onSave?: (node: Nodes) => void;
  onRemove?: (node: Nodes) => void;
};

export class LinkPopup {

  private config: LinkPopupConfig;

  private root: Nodes;

  private locale: TranslationFunctions;

  private linkNode: Nodes | null = null;

  public container: Nodes;

  constructor(config: LinkPopupConfig) {
    this.config = config;
    this.root = config.root;
    this.locale = config.locale || i18nObject('en-US');
    this.container = query(safeTemplate`
      <div class="lake-link-popup">
        <div class="lake-row">${this.locale.link.url()}</div>
        <div class="lake-row lake-url-row">
          <input type="text" name="url" />
        </div>
        <div class="lake-row">${this.locale.link.title()}</div>
        <div class="lake-row">
          <input type="text" name="title" />
        </div>
        <div class="lake-row lake-button-row"></div>
      </div>
    `);
  }

  // Writes the specified text to the system clipboard
  private async writeClipboardText(text: string): Promise<boolean> {
    let error = false;
    try {
      if (window.LAKE_TEST) {
        error = window.LAKE_ERROR;
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      error = true;
    }
    return new Promise(resolve => {
      resolve(error);
    });
  }

  // Copy link to clipboard
  private appendCopyButton(): void {
    const config = this.config;
    let timeoutId: number | null = null;
    const button = new Button({
      root: this.container.find('.lake-url-row'),
      name: 'copy',
      icon: icons.get('copy'),
      tooltip: this.locale.link.copy(),
      onClick: () => {
        if (!this.linkNode) {
          return;
        }
        const url = this.getInputValue('url');
        this.writeClipboardText(url).then((error: boolean) => {
          const svgNode = this.container.find('button[name="copy"] svg');
          svgNode.hide();
          if (error) {
            svgNode.eq(2).show('inline');
            if (config.onCopy) {
              config.onCopy(error);
            }
            return;
          }
          svgNode.eq(1).show('inline');
          if (config.onCopy) {
            config.onCopy(error);
          }
          if (timeoutId) {
            window.clearTimeout(timeoutId);
          }
          timeoutId = window.setTimeout(() => {
            svgNode.hide();
            svgNode.eq(0).show('inline');
          }, 2000);
        });
      },
    });
    button.render();
    const copyDoneIcon = icons.get('checkCircle');
    if (copyDoneIcon) {
      button.node.append(copyDoneIcon);
    }
    const copyErrorIcon = icons.get('warningCircle');
    if (copyErrorIcon) {
      button.node.append(copyErrorIcon);
    }
  }

  // Open link in new tab
  private appendOpenButton(): void {
    const button = new Button({
      root: this.container.find('.lake-url-row'),
      name: 'open',
      icon: icons.get('open'),
      tooltip: this.locale.link.open(),
      onClick: () => {
        if (!this.linkNode) {
          return;
        }
        const url = this.getInputValue('url');
        window.open(url);
      },
    });
    button.render();
  }

  // Save link
  private appendSaveButton(): void {
    const button = new Button({
      root: this.container.find('.lake-button-row'),
      name: 'save',
      icon: icons.get('check'),
      text: this.locale.link.save(),
      onClick: () => {
        if (!this.linkNode) {
          return;
        }
        const linkNode = this.linkNode;
        this.save();
        this.hide();
        if (this.config.onSave) {
          this.config.onSave(linkNode);
        }
      },
    });
    button.render();
    this.container.find('input[name="url"]').on('keydown', event => {
      if (isKeyHotkey('enter', event as KeyboardEvent)) {
        event.preventDefault();
        button.node.emit('click');
      }
    });
    this.container.find('input[name="title"]').on('keydown', event => {
      if (isKeyHotkey('enter', event as KeyboardEvent)) {
        event.preventDefault();
        button.node.emit('click');
      }
    });
  }

  // Remove link
  private appendUnlinkButton(): void {
    const button = new Button({
      root: this.container.find('.lake-button-row'),
      name: 'unlink',
      icon: icons.get('unlink'),
      text: this.locale.link.unlink(),
      onClick: () => {
        if (!this.linkNode) {
          return;
        }
        const lastChild = this.linkNode.last();
        this.linkNode.remove(true);
        this.hide();
        if (this.config.onRemove) {
          this.config.onRemove(lastChild);
        }
      },
    });
    button.render();
  }

  public getInputValue(name: string): string {
    const inputElement = this.container.find(`input[name="${name}"]`);
    const nativeInputElement = inputElement.get(0) as HTMLInputElement;
    return nativeInputElement.value;
  }

  public setInputValue(name: string, value: string): void {
    const inputElement = this.container.find(`input[name="${name}"]`);
    const nativeInputElement = inputElement.get(0) as HTMLInputElement;
    nativeInputElement.value = value;
  }

  public save(): void {
    if (!this.linkNode) {
      return;
    }
    const url = this.getInputValue('url');
    let title = this.getInputValue('title');
    if (url === '' && title === '') {
      this.linkNode.remove();
      return;
    }
    if (title === '') {
      title = url;
    }
    this.linkNode.attr('href', url);
    this.linkNode.text(title);
  }

  public position(): void {
    if (!this.linkNode) {
      return;
    }
    const position = nodePosition(this.linkNode);
    if (position.left < 0 || position.right < 0 || position.top < 0 || position.bottom < 0) {
      this.container.css('visibility', 'hidden');
      return;
    }
    this.container.css('visibility', '');
    const linkNativeNode = this.linkNode.get(0) as HTMLElement;
    // Returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
    const linkRect = linkNativeNode.getBoundingClientRect();
    const linkX = linkRect.x + window.scrollX;
    const linkY = linkRect.y + window.scrollY;
    // link.x + popup.width > window.width
    if (linkRect.x + this.container.width() > window.innerWidth) {
      // link.x + window.scrollX - (popup.width - link.width)
      this.container.css('left', `${linkX - this.container.width() + linkRect.width}px`);
    } else {
      this.container.css('left', `${linkX}px`);
    }
    // link.y + link.height + popup.height > window.height
    if (linkRect.y + linkRect.height + this.container.height() > window.innerHeight) {
      // link.y + window.scrollY - popup.height
      this.container.css('top', `${linkY - this.container.height()}px`);
    } else {
      this.container.css('top', `${linkY + linkRect.height}px`);
    }
  }

  public render(): void {
    this.appendCopyButton();
    this.appendOpenButton();
    this.appendSaveButton();
    this.appendUnlinkButton();
    this.root.append(this.container);
  }

  public show(linkNode: Nodes): void {
    if (this.root.find('.lake-link-popup').length === 0) {
      this.render();
    }
    if (this.linkNode && this.linkNode.get(0) === linkNode.get(0)) {
      return;
    }
    this.linkNode = linkNode;
    const url = linkNode.attr('href');
    const title = linkNode.text();
    this.setInputValue('url', url);
    if (title !== url) {
      this.setInputValue('title', title);
    }
    this.container.css('visibility', 'hidden');
    this.container.show();
    this.position();
    this.container.css('visibility', '');
    this.container.find('input[name="url"]').focus();
  }

  public hide(): void {
    this.linkNode = null;
    this.container.hide();
  }
}
