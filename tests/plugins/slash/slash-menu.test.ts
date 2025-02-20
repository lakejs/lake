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

describe('plugins / slash / slash-menu', () => {

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

  it('show method: should search an item', () => {
    const menu = new SlashMenu({
      items: slashItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range, 'code block');
    expect(menu.container.find('.lake-menu-item').length).to.equal(1);
    menu.unmount();
  });

  it('update method: should update items', () => {
    const menu = new SlashMenu({
      items: slashItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range);
    expect(menu.container.find('.lake-menu-item').length > 1).to.equal(true);
    menu.update('codeblock');
    expect(menu.container.find('.lake-menu-item').length).to.equal(1);
    menu.unmount();
  });

});
