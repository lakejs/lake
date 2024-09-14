import { query } from '../../src/utils';
import { MentionPopup } from '../../src/ui/mention-popup';
import { Editor } from '../../src';

type MentionItem = {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
};

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
];

describe('ui / mention-popup-ui', () => {

  it('mention popup', () => {
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

});
