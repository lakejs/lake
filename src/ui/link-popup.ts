import EventEmitter from 'eventemitter3';
import { icons } from '../icons';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Button } from './button';
import { locale } from '../i18n';

export class LinkPopup {
  private linkNode: Nodes | null = null;

  public container: Nodes;

  public event: EventEmitter = new EventEmitter();

  constructor(root: Nodes) {
    this.container = query(safeTemplate`
      <div class="lake-link-popup">
        <div class="lake-row">${locale.link.url()}</div>
        <div class="lake-row lake-url-row">
          <input type="text" name="url" />
        </div>
        <div class="lake-row">${locale.link.title()}</div>
        <div class="lake-row">
          <input type="text" name="title" />
        </div>
        <div class="lake-row lake-button-row"></div>
      </div>
    `);
    this.appendCopyButton();
    this.appendOpenButton();
    this.appendSaveButton();
    this.appendUnlinkButton();
    root.append(this.container);
  }

  // Writes the specified text to the system clipboard
  private async writeClipboardText(text: string): Promise<boolean> {
    let error = false;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      error = true;
    }
    return new Promise(resolve => {
      resolve(error);
    });
  }

  // Copy link to clipboard
  private appendCopyButton(): void {
    let timeoutId: number | null = null;
    const button = new Button({
      root: this.container.find('.lake-url-row'),
      name: 'copy',
      icon: icons.get('copy'),
      tooltip: locale.link.copy(),
      onClick: () => {
        if (!this.linkNode) {
          return;
        }
        const url = this.getInputValue('url');
        this.writeClipboardText(url).then(error => {
          const svgNode = this.container.find('button[name="copy"] svg');
          svgNode.hide();
          if (error) {
            svgNode.eq(2).show('inline');
            return;
          }
          svgNode.eq(1).show('inline');
          this.event.emit('copy');
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
      tooltip: locale.link.open(),
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
      text: locale.link.save(),
      onClick: () => {
        if (!this.linkNode) {
          return;
        }
        this.save();
        this.hide();
        this.event.emit('save');
      },
    });
    button.render();
  }

  // Remove link
  private appendUnlinkButton(): void {
    const button = new Button({
      root: this.container.find('.lake-button-row'),
      name: 'unlink',
      icon: icons.get('unlink'),
      text: locale.link.unlink(),
      onClick: () => {
        if (!this.linkNode) {
          return;
        }
        this.linkNode.remove(true);
        this.hide();
        this.event.emit('remove');
      },
    });
    button.render();
  }

  private getInputValue(name: string): string {
    const inputElement = this.container.find(`input[name="${name}"]`);
    const nativeInputElement = inputElement.get(0) as HTMLInputElement;
    return nativeInputElement.value;
  }

  private setInputValue(name: string, value: string): void {
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
    if (title === '') {
      title = 'Link';
    }
    this.linkNode.attr('href', url);
    this.linkNode.text(title);
  }

  public updatePosition(): void {
    if (!this.linkNode) {
      return;
    }
    const linkNativeNode = this.linkNode.get(0) as HTMLElement;
    // Returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
    const linkRect = linkNativeNode.getBoundingClientRect();
    const linkX = linkRect.x + window.scrollX;
    const linkY = linkRect.y + window.scrollY;
    if (linkX < 0 || linkY < 0) {
      this.hide();
      return;
    }
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

  public show(linkNode: Nodes): void {
    this.linkNode = linkNode;
    const url = linkNode.attr('href');
    const title = linkNode.text();
    this.setInputValue('url', url);
    this.setInputValue('title', title);
    this.container.css('visibility', 'hidden');
    this.container.show();
    this.updatePosition();
    this.container.css('visibility', '');
    this.container.find('input[name="url"]').focus();
  }

  public hide(): void {
    this.linkNode = null;
    this.container.hide();
  }
}
