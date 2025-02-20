import { query } from '@/utils/query';
import { Editor } from '@/editor';
import { MentionItem } from '@/plugins/mention/types';
import { MentionMenu } from '@/plugins/mention/mention-menu';

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
  {
    id: '5',
    name: 'luolonghao',
    nickname: 'Roddy',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '6',
    name: 'heavenlake',
    nickname: 'Heaven Lake',
    avatar: '<img src="../assets/images/heaven-lake-256.png" />',
  },
  {
    id: '7',
    name: 'lacgentau',
    nickname: 'Lac Gentau',
    avatar: '<img src="../assets/images/lac-gentau-256.jpg" />',
  },
  {
    id: '8',
    name: 'universalstudios',
    nickname: 'Universal Studios',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '9',
    name: 'luolonghao',
    nickname: 'Roddy',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '10',
    name: 'heavenlake',
    nickname: 'Heaven Lake',
    avatar: '<img src="../assets/images/heaven-lake-256.png" />',
  },
  {
    id: '11',
    name: 'lacgentau',
    nickname: 'Lac Gentau',
    avatar: '<img src="../assets/images/lac-gentau-256.jpg" />',
  },
  {
    id: '12',
    name: 'universalstudios',
    nickname: 'Universal Studios',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
];

describe('plugins / mention / mention-menu-ui', () => {

  it('should show mention menu with avatar', () => {
    const rootNode = query('<div class="lake-root lake-ui-test"></div>');
    query(document.body).append(rootNode);
    const editor = new Editor({
      root: rootNode,
      value: '<p>@<focus /></p>',
    });
    editor.render();
    const menu = new MentionMenu({
      items: mentionItems,
    });
    menu.container.addClass('lake-ui-test');
    const mentionRange = editor.selection.range.clone();
    mentionRange.selectNodeContents(editor.container);
    menu.show(mentionRange);
    expect(menu.container.get(0).isConnected).to.equal(true);
  });

  it('should show mention menu without avatar', () => {
    const rootNode = query('<div class="lake-root lake-ui-test"></div>');
    query(document.body).append(rootNode);
    const editor = new Editor({
      root: rootNode,
      value: '<p>@<focus /></p>',
    });
    editor.render();
    const menu = new MentionMenu({
      items: mentionItems.map(item => ({
        id: item.id,
        name: item.name,
        nickname: item.nickname,
      })),
    });
    menu.container.addClass('lake-ui-test');
    const mentionRange = editor.selection.range.clone();
    mentionRange.selectNodeContents(editor.container);
    menu.show(mentionRange);
    expect(menu.container.get(0).isConnected).to.equal(true);
  });

  it('should show mention menu without nickname', () => {
    const rootNode = query('<div class="lake-root lake-ui-test"></div>');
    query(document.body).append(rootNode);
    const editor = new Editor({
      root: rootNode,
      value: '<p>@<focus /></p>',
    });
    editor.render();
    const menu = new MentionMenu({
      items: mentionItems.map(item => ({
        id: item.id,
        name: item.name,
        avatar: item.avatar,
      })),
    });
    menu.container.addClass('lake-ui-test');
    const mentionRange = editor.selection.range.clone();
    mentionRange.selectNodeContents(editor.container);
    menu.show(mentionRange);
    expect(menu.container.get(0).isConnected).to.equal(true);
  });

});
