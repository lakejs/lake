import { MentionItem } from '../../src/types/mention';
import { query } from '../../src/utils';
import { MentionPopup } from '../../src/ui/mention-popup';
import { Editor } from '../../src';

const memtionItems: MentionItem[] = [
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

describe('ui / mention-popup-ui', () => {

  it('with avatar', () => {
    const rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    const editor = new Editor({
      root: rootNode,
      value: '<p>@<focus /></p>',
    });
    editor.render();
    const popup = new MentionPopup({
      editor,
      items: memtionItems,
    });
    const mentionRange = editor.selection.range.clone();
    mentionRange.selectNodeContents(editor.container);
    popup.show(mentionRange);
    expect(editor.popupContainer.find('.lake-mention-popup').length).to.equal(1);
  });

  it('without avatar', () => {
    const rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    const editor = new Editor({
      root: rootNode,
      value: '<p>@<focus /></p>',
    });
    editor.render();
    const popup = new MentionPopup({
      editor,
      items: memtionItems.map(item => ({
        id: item.id,
        name: item.name,
        nickname: item.nickname,
      })),
    });
    const mentionRange = editor.selection.range.clone();
    mentionRange.selectNodeContents(editor.container);
    popup.show(mentionRange);
    expect(editor.popupContainer.find('.lake-mention-popup').length).to.equal(1);
  });

  it('without nickname', () => {
    const rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    const editor = new Editor({
      root: rootNode,
      value: '<p>@<focus /></p>',
    });
    editor.render();
    const popup = new MentionPopup({
      editor,
      items: memtionItems.map(item => ({
        id: item.id,
        name: item.name,
        avatar: item.avatar,
      })),
    });
    const mentionRange = editor.selection.range.clone();
    mentionRange.selectNodeContents(editor.container);
    popup.show(mentionRange);
    expect(editor.popupContainer.find('.lake-mention-popup').length).to.equal(1);
  });

});
