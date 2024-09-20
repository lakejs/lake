import { query } from '../../src/utils';
import { SlashMenu } from '../../src/ui/slash-menu';
import { Editor, Nodes, Range, SlashItem, icons } from '../../src';

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

  beforeEach(()=> {
    rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('should show and hide menu', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const menu = new SlashMenu({
      editor,
      root: editor.popupContainer,
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
    editor.unmount();
  });

  it('keydown event: should select an item using keyboard', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const menu = new SlashMenu({
      editor,
      root: editor.popupContainer,
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
    editor.unmount();
  });

  it('show method: should search an item', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const menu = new SlashMenu({
      editor,
      root: editor.popupContainer,
      items: slashItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range, 'code block');
    expect(menu.container.find('.lake-menu-item').length).to.equal(1);
    menu.unmount();
    editor.unmount();
  });

  it('update method: should update items', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const menu = new SlashMenu({
      editor,
      root: editor.popupContainer,
      items: slashItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range);
    expect(menu.container.find('.lake-menu-item').length > 1).to.equal(true);
    menu.update('code block');
    expect(menu.container.find('.lake-menu-item').length).to.equal(1);
    menu.unmount();
    editor.unmount();
  });

});
