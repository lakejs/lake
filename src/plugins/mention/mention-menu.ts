import './mention-menu.css';
import { template } from 'lakelib/utils/template';
import { query } from 'lakelib/utils/query';
import { Nodes } from 'lakelib/models/nodes';
import { Menu, MenuConfig } from 'lakelib/ui/menu';
import { MentionItem } from './types';

type OnSelect = (event: Event, item: MentionItem) => void;

type MentionMenuConfig = MenuConfig<MentionItem> & {
  onSelect?: OnSelect;
};

const emptyCallback = () => {};

// The MentionMenu class, inheriting from the Menu class, represents a list of users for selecting a user.
export class MentionMenu extends Menu<MentionItem> {

  private onSelect: OnSelect;

  constructor(config: MentionMenuConfig) {
    super(config);
    this.onSelect = config.onSelect || emptyCallback;
    this.container.addClass('lake-mention-menu');
  }

  protected getItemNode(item: MentionItem): Nodes {
    const itemNode = query(template`
      <li>
        <div class="lake-mention-avatar"></div>
        <div class="lake-mention-nickname">${item.nickname ?? item.name}</div>
        <div class="lake-mention-name">(${item.name})</div>
      </li>
    `);
    const avatarNode = itemNode.find('.lake-mention-avatar');
    if (item.avatar) {
      avatarNode.append(item.avatar);
    } else {
      avatarNode.remove();
    }
    if (!item.nickname) {
      itemNode.find('.lake-mention-name').remove();
    }
    itemNode.on('click', event => this.onSelect(event, item));
    return itemNode;
  }

  protected search(keyword: string): MentionItem[] {
    keyword = keyword.toLowerCase();
    const items: MentionItem[] = [];
    for (const item of this.items) {
      const nickname = item.nickname ?? item.name;
      if (
        item.name.toLowerCase().indexOf(keyword) >= 0 ||
        nickname.toLowerCase().indexOf(keyword) >= 0 ||
        nickname.replace(/\s+/g, '').indexOf(keyword) >= 0
      ) {
        items.push(item);
      }
    }
    return items;
  }
}
