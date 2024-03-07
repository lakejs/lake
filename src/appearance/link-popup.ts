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
        <div class="lake-row lake-unlink-row">
          <div class="lake-unlink">
            <button type="button" class="lake-button-unlink" title="Remove link"></button>
            <div class="lake-unlink-text">Remove link</div>
          </div>
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
    // Update URL of current link
    this.root.find('input[name="url"]').on('input', () => {
      if (!this.linkNode) {
        return;
      }
      this.linkNode.attr('href', encode(this.getInputValue('url')));
    });
    // Update title of current link
    this.root.find('input[name="title"]').on('input', () => {
      if (!this.linkNode) {
        return;
      }
      this.linkNode.html(encode(this.getInputValue('title')));
    });
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
    // Remove link
    this.root.find('.lake-unlink').on('click', () => {
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

  public updatePosition(linkNode: Nodes): void {
    const linkNativeNode = linkNode.get(0) as NativeHTMLElement;
    const rect = linkNativeNode.getBoundingClientRect();
    const offsetLeft = linkNativeNode.offsetLeft;
    const offsetTop = linkNativeNode.offsetTop + rect.height;
    this.root.css({
      left: `${offsetLeft}px`,
      top: `${offsetTop}px`,
    });
  }

  public show(linkNode: Nodes): void {
    this.linkNode = linkNode;
    const url = linkNode.attr('href');
    const title = linkNode.text();
    this.setInputValue('url', url);
    this.setInputValue('title', title);
    this.updatePosition(linkNode);
    this.root.show();
  }

  public hide(): void {
    this.linkNode = null;
    this.root.hide();
  }
}
