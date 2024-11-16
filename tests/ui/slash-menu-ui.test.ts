import { query } from '../../src/utils/query';
import { SlashMenu } from '../../src/ui/slash-menu';
import { Editor, SlashItem, icons } from '../../src';

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

describe('ui / slash-menu-ui', () => {

  it('should show slash menu', () => {
    const rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const menu = new SlashMenu({
      items: slashItems,
    });
    const slashRange = editor.selection.range.clone();
    slashRange.selectNodeContents(editor.container);
    menu.show(slashRange);
    expect(menu.container.get(0).isConnected).to.equal(true);
  });

});
