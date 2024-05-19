import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';

type ButtonConfig = {
  root: Nodes;
  name: string;
  type?: 'primary' | 'default';
  icon?: string;
  text?: string;
  tooltip?: string;
  tabIndex?: number,
  onClick: () => void;
}

export class Button {
  private config: ButtonConfig;

  private root: Nodes;

  public node: Nodes;

  constructor(config: ButtonConfig) {
    this.config = config;
    this.root = config.root;
    this.node = query(safeTemplate`
      <button type="button" name="${config.name}" class="lake-button" />
    `);
    if (config.type) {
      this.node.addClass(`lake-${config.type}-button`);
    }
    if (config.tabIndex !== undefined) {
      this.node.attr('tabindex', config.tabIndex.toString());
    }
  }

  public render(): void {
    const config = this.config;
    const buttonNode = this.node;
    buttonNode.addClass(`lake-${config.text ? 'text' : 'icon'}-button`);
    if (config.tooltip) {
      buttonNode.attr('title', config.tooltip);
    }
    if (config.icon) {
      buttonNode.append(config.icon);
    }
    if (config.text) {
      buttonNode.append(`<span>${config.text}</span>`);
    }
    this.root.append(buttonNode);
    buttonNode.on('mouseenter', () => {
      if (buttonNode.attr('disabled')) {
        return;
      }
      if (buttonNode.hasClass('lake-button-selected')) {
        return;
      }
      buttonNode.addClass('lake-button-hovered');
    });
    buttonNode.on('mouseleave', () => {
      if (buttonNode.attr('disabled')) {
        return;
      }
      buttonNode.removeClass('lake-button-hovered');
    });
    buttonNode.on('click', event => {
      event.preventDefault();
      config.onClick();
    });
  }
}
