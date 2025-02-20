import { icons } from '@/icons';
import { query } from '@/utils/query';
import { Nodes } from '@/models/nodes';
import { Range } from '@/models/range';
import { Editor } from '@/editor';
import { SlashItem } from '@/plugins/slash/types';
import { SlashMenu } from '@/plugins/slash/slash-menu';

const boldSlashItem: SlashItem = {
  name: 'bold',
  type: 'button',
  icon: icons.get('bold'),
  title: 'Bold',
  description: 'Toggle bold',
  onClick: (editor, value) => {
    editor.command.execute(value);
  },
};

const slashItems: (string | SlashItem)[] = [
  boldSlashItem,
  'image',
  'file',
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'paragraph',
  'blockQuote',
  'numberedList',
  'bulletedList',
  'checklist',
  'hr',
  'codeBlock',
  'video',
  'equation',
];

describe('ui / menu', () => {

  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(() => {
    rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should show and hide menu', () => {
    const menu = new SlashMenu({
      items: slashItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range);
    expect(menu.visible).to.equal(true);
    const firstItem = menu.container.find('.lake-menu-item').eq(0);
    firstItem.emit('mouseenter');
    expect(firstItem.hasClass('lake-menu-item-selected')).to.equal(true);
    firstItem.emit('mouseleave');
    expect(firstItem.hasClass('lake-menu-item-selected')).to.equal(false);
    menu.hide();
    expect(menu.visible).to.equal(false);
    menu.show(range);
    expect(menu.visible).to.equal(true);
    menu.unmount();
    expect(menu.visible).to.equal(false);
  });

  it('should not show menu with empty items', () => {
    const menu = new SlashMenu({
      items: [],
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range);
    expect(menu.visible).to.equal(false);
    menu.unmount();
  });

  it('should not show menu with collapsed range', () => {
    const menu = new SlashMenu({
      items: slashItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    range.collapseToStart();
    menu.show(range, 'heading');
    expect(menu.visible).to.equal(false);
    menu.unmount();
  });

  it('keydown event: should select an item using keyboard', () => {
    const menu = new SlashMenu({
      items: slashItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range);
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    }));
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    }));
    expect(menu.container.find('.lake-menu-item').eq(2).hasClass('lake-menu-item-selected')).to.equal(true);
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowUp',
    }));
    expect(menu.container.find('.lake-menu-item').eq(1).hasClass('lake-menu-item-selected')).to.equal(true);
    expect(menu.visible).to.equal(true);
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
    }));
    expect(menu.visible).to.equal(false);
    menu.unmount();
  });

});
