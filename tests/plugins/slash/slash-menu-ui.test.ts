import { SlashItem } from 'lakelib/types/slash';
import { icons } from 'lakelib/icons';
import { query } from 'lakelib/utils/query';
import { Editor } from 'lakelib/editor';
import { SlashMenu } from 'lakelib/plugins/slash/slash-menu';

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

describe('plugins / slash / slash-menu-ui', () => {

  it('should show slash menu', () => {
    const rootNode = query('<div class="lake-root lake-ui-test"></div>');
    query(document.body).append(rootNode);
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const menu = new SlashMenu({
      items: slashItems,
    });
    menu.container.addClass('lake-ui-test');
    const slashRange = editor.selection.range.clone();
    slashRange.selectNodeContents(editor.container);
    menu.show(slashRange);
    expect(menu.container.get(0).isConnected).to.equal(true);
  });

});
