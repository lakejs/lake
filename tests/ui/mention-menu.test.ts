import { query } from '../../src/utils';
import { MentionMenu } from '../../src/ui/mention-menu';
import { Editor, Nodes, Range, MentionItem } from '../../src';

const mentionItems: MentionItem[] = [
  {
    id: '1',
    name: 'luolonghao',
    nickname: 'Roddy',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '2',
    name: 'heavenlake',
    nickname: 'Heaven Lake',
    avatar: '<img src="../assets/images/heaven-lake-256.png" />',
  },
  {
    id: '3',
    name: 'lacgentau',
    nickname: 'Lac Gentau',
    avatar: '<img src="../assets/images/lac-gentau-256.jpg" />',
  },
  {
    id: '4',
    name: 'universalstudios',
    nickname: 'Universal Studios',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
];

describe('ui / mention-menu', () => {

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
      value: '<p>@<focus /></p>',
    });
    editor.render();
    const menu = new MentionMenu({
      editor,
      items: mentionItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range);
    const items = menu.search('Heaven');
    expect(items.length).to.deep.equal(1);
    menu.unmount();
    editor.unmount();
  });

  it('search method: should search an item using a keyword without spaces', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>@<focus /></p>',
    });
    editor.render();
    const menu = new MentionMenu({
      editor,
      items: mentionItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range);
    const items = menu.search('HeavenLake');
    expect(items.length).to.deep.equal(1);
    menu.unmount();
    editor.unmount();
  });

});
