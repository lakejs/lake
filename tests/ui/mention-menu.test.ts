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
  let editor: Editor;

  beforeEach(()=> {
    rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p>@<focus /></p>',
    });
    editor.render();
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('show method: should search an item', () => {
    const menu = new MentionMenu({
      editor,
      items: mentionItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range, 'heaven');
    expect(menu.container.find('.lake-menu-item').length).to.equal(1);
    menu.unmount();
  });

  it('update method: should update items', () => {
    const menu = new MentionMenu({
      editor,
      items: mentionItems,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    menu.show(range);
    expect(menu.container.find('.lake-menu-item').length > 1).to.equal(true);
    menu.update('heavenlake');
    expect(menu.container.find('.lake-menu-item').length).to.equal(1);
    menu.unmount();
  });

});
