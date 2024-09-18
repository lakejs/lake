import { query } from '../../src/utils';
import { SlashPopup } from '../../src/ui/slash-popup';
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

describe('ui / slash-popup', () => {

  let rootNode: Nodes;

  beforeEach(()=> {
    rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('search method: should search an item', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const popup = new SlashPopup({
      editor,
      items: slashItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    popup.show(range);
    const items = popup.search('code block');
    expect(items).to.deep.equal(['codeBlock']);
    popup.unmount();
    editor.unmount();
  });

  it('search method: should search an item using a keyword without spaces', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const popup = new SlashPopup({
      editor,
      items: slashItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    popup.show(range);
    const items = popup.search('codeblock');
    expect(items).to.deep.equal(['codeBlock']);
    popup.unmount();
    editor.unmount();
  });

});
