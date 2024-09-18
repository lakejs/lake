import { MentionItem } from '../types/mention';
import { safeTemplate } from '../utils/safe-template';
import { query } from '../utils/query';
import { Nodes } from '../models/nodes';
import { Menu, MenuConfig } from './menu';

export class MentionMenu extends Menu<MentionItem> {

  constructor(config: MenuConfig<MentionItem>) {
    super(config);
    this.container.addClass('lake-mention-menu');
  }

  protected getItemNode(item: MentionItem): Nodes {
    const editor = this.editor;
    const itemNode = query(safeTemplate`
      <li class="lake-menu-item" item-id="${item.id}">
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
    itemNode.on('click', () => {
      this.hide();
      editor.focus();
      const targetRange = editor.selection.range.getCharacterRange('@');
      if (targetRange) {
        targetRange.get().deleteContents();
      }
      editor.selection.insertBox('mention', item);
      editor.history.save();
    });
    return itemNode;
  }

  public search(keyword: string): MentionItem[] {
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
