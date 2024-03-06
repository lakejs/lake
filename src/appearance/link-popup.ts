import { NativeHTMLElement } from '../types/native';
import { icons } from '../icons';
import { encode } from '../utils/encode';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';

type Config = {
  target: Nodes,
  onRemove: () => void,
};

export class LinkPopup {

  public config: Config;

  public root: Nodes;

  public urlInput: Nodes;

  public titleInput: Nodes;

  public copyButton: Nodes;

  public openButton: Nodes;

  public unlinkButton: Nodes;

  private linkNode: Nodes | null = null;

  constructor(config: Config) {
    this.config = config;
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
          <div class="lake-unlink" data-role="remove">
            <button type="button" class="lake-button-unlink" title="Remove link"></button>
            <div class="lake-unlink-text">Remove link</div>
          </div>
        </div>
      </div>
    `);
    this.urlInput = this.root.find('input[name="url"]');
    this.titleInput = this.root.find('input[name="title"]');
    this.openButton = this.root.find('.lake-button-open');
    const openIcon = icons.get('open');
    if (openIcon) {
      this.openButton.append(openIcon);
    }
    this.copyButton = this.root.find('.lake-button-copy');
    const copyIcon = icons.get('copy');
    if (copyIcon) {
      this.copyButton.append(copyIcon);
    }
    this.unlinkButton = this.root.find('.lake-button-unlink');
    const unlinkIcon = icons.get('unlink');
    if (unlinkIcon) {
      this.unlinkButton.prepend(unlinkIcon);
    }
    config.target.append(this.root);
    this.bindEvents();
  }

  private bindEvents(): void {
    this.urlInput.on('input', () => {
      if (!this.linkNode) {
        return;
      }
      this.linkNode.attr('href', encode(this.getUrl()));
    });
    this.titleInput.on('input', () => {
      if (!this.linkNode) {
        return;
      }
      this.linkNode.html(encode(this.getTitle()));
    });
    this.root.find('[data-role="remove"]').on('click', () => {
      if (this.linkNode) {
        this.linkNode.remove(true);
      }
      this.config.onRemove();
    });
  }

  private getInputValue(inputElement: Nodes): string {
    const nativeInputElement = inputElement.get(0) as HTMLInputElement;
    return nativeInputElement.value;
  }

  private setInputValue(inputElement: Nodes, value: string): void {
    const nativeInputElement = inputElement.get(0) as HTMLInputElement;
    nativeInputElement.value = value;
  }

  public getUrl(): string {
    return this.getInputValue(this.urlInput);
  }

  public getTitle(): string {
    return this.getInputValue(this.titleInput);
  }

  public setUrl(value: string): void {
    this.setInputValue(this.urlInput, value);
  }

  public setTitle(value: string): void {
    this.setInputValue(this.titleInput, value);
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
    const url = linkNode.attr('href');
    const title = linkNode.text();
    this.setUrl(url);
    this.setTitle(title);
    this.updatePosition(linkNode);
    this.linkNode = linkNode;
    this.root.show();
  }

  public hide(): void {
    this.root.hide();
  }
}
