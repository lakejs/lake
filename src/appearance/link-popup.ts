import EventEmitter from 'eventemitter3';
import { NativeHTMLElement } from '../types/native';
import { icons } from '../icons';
import { encode } from '../utils/encode';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';

export class LinkPopup {
  private linkNode: Nodes | null;

  public root: Nodes;

  public event: EventEmitter;

  constructor(target: Nodes) {
    this.linkNode = null;
    this.event = new EventEmitter();
    this.root = query(safeTemplate`
      <div class="lake-link-popup">
        <div class="lake-row">URL</div>
        <div class="lake-row lake-url-row">
          <input type="text" name="url" />
          <button type="button" class="lake-button-copy" title="Copy link to clipboard"></button>
          <button type="button" class="lake-button-open" title="Open link in new tab"></button>
        </div>
        <div class="lake-row">Link title</div>
        <div class="lake-row">
          <input type="text" name="title" />
        </div>
        <div class="lake-row">
          <button type="button" class="lake-button-save"><span>Save</span></button>
          <button type="button" class="lake-button-unlink"><span>Remove link</span></button>
        </div>
      </div>
    `);
    const openIcon = icons.get('open');
    if (openIcon) {
      this.root.find('.lake-button-open').append(openIcon);
    }
    const copyButton = this.root.find('.lake-button-copy');
    const copyIcon = icons.get('copy');
    if (copyIcon) {
      copyButton.append(copyIcon);
    }
    const copyDoneIcon = icons.get('copyDone');
    if (copyDoneIcon) {
      copyButton.append(copyDoneIcon);
    }
    const copyErrorIcon = icons.get('copyError');
    if (copyErrorIcon) {
      copyButton.append(copyErrorIcon);
    }
    const saveIcon = icons.get('check');
    if (saveIcon) {
      this.root.find('.lake-button-save').prepend(saveIcon);
    }
    const unlinkIcon = icons.get('unlink');
    if (unlinkIcon) {
      this.root.find('.lake-button-unlink').prepend(unlinkIcon);
    }
    target.append(this.root);
    this.bindEvents();
  }

  private async writeClipboardText(text: string, errorCallback: () => void) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      errorCallback();
    }
  }

  private bindEvents(): void {
    // Copy link to clipboard
    let timeoutId: number | null = null;
    this.root.find('.lake-button-copy').on('click', () => {
      if (!this.linkNode) {
        return;
      }
      const url = this.getInputValue('url');
      this.writeClipboardText(url, () => {
        const svgNode = this.root.find('.lake-button-copy svg');
        svgNode.hide();
        svgNode.eq(2).show('inline');
      });
      const svgNode = this.root.find('.lake-button-copy svg');
      svgNode.hide();
      svgNode.eq(1).show('inline');
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        svgNode.hide();
        svgNode.eq(0).show('inline');
      }, 2000);
    });
    // Open link in new tab
    this.root.find('.lake-button-open').on('click', () => {
      if (!this.linkNode) {
        return;
      }
      const url = this.getInputValue('url');
      window.open(url);
    });
    // Save link
    this.root.find('.lake-button-save').on('click', () => {
      if (!this.linkNode) {
        return;
      }
      this.save();
      this.event.emit('save');
    });
    // Remove link
    this.root.find('.lake-button-unlink').on('click', () => {
      if (!this.linkNode) {
        return;
      }
      this.linkNode.remove(true);
      this.event.emit('remove');
    });
  }

  private getInputValue(name: string): string {
    const inputElement = this.root.find(`input[name="${name}"]`);
    const nativeInputElement = inputElement.get(0) as HTMLInputElement;
    return nativeInputElement.value;
  }

  private setInputValue(name: string, value: string): void {
    const inputElement = this.root.find(`input[name="${name}"]`);
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
    this.linkNode.html(encode(title));
  }

  public updatePosition(): void {
    if (!this.linkNode) {
      return;
    }
    const rootNativeNode = this.root.get(0) as NativeHTMLElement;
    const linkNativeNode = this.linkNode.get(0) as NativeHTMLElement;
    const rect = linkNativeNode.getBoundingClientRect();
    if (rect.left < 0 || rect.top < 0) {
      this.hide();
      return;
    }
    if (rect.left + rootNativeNode.clientWidth > window.innerWidth) {
      this.root.css('left', `${rect.left - rootNativeNode.clientWidth + rect.width}px`);
    } else {
      this.root.css('left', `${rect.left}px`);
    }
    if (rect.top + rect.height + rootNativeNode.clientHeight > window.innerHeight) {
      this.root.css('top', `${rect.top - rootNativeNode.clientHeight}px`);
    } else {
      this.root.css('top', `${rect.top + rect.height}px`);
    }
  }

  public show(linkNode: Nodes): void {
    this.linkNode = linkNode;
    const url = linkNode.attr('href');
    const title = linkNode.text();
    this.setInputValue('url', url);
    this.setInputValue('title', title);
    this.root.css('visibility', 'hidden');
    this.root.show();
    this.updatePosition();
    this.root.css('visibility', '');
  }

  public hide(): void {
    this.linkNode = null;
    this.root.hide();
  }
}
