import { click, removeBoxValueFromHTML } from '../utils';
import { MentionItem } from '../../src/types/mention';
import { query } from '../../src/utils';
import { Editor, Nodes } from '../../src';

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

describe('plugins / mention', () => {

  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(()=> {
    rootNode = query('<div class="lake-editor"><div class="lake-root"></div></div>');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode.find('.lake-root'),
      value: '<p><br /><focus /></p>',
      mention: {
        items: mentionItems,
      },
    });
    editor.render();
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should return correct config', () => {
    expect(editor.config.mention.requestMethod).to.equal('GET');
    expect(editor.config.mention.items).to.deep.equal(mentionItems);
  });

  it('should show a popup box', () => {
    editor.setValue('<p>@<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('block');
  });

  it('should search for a custom item', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').find('.lake-mention-item').length).to.equal(1);
  });

  it('should show a popup box when there is no block', () => {
    editor.setValue('@<focus />');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').length).to.equal(1);
  });

  it('should not show a popup box when there is no mention', () => {
    editor.setValue('<p>roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').length).to.equal(0);
  });

  it('should hide a popup box when the search result is empty', () => {
    editor.setValue('<p>@roddy2<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('none');
  });

  it('should insert an mention box by clicking', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    click(editor.popupContainer.find('.lake-mention-item').eq(0));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('none');
    const value = removeBoxValueFromHTML(editor.getValue());
    expect(value).to.equal('<p><lake-box type="inline" name="mention" focus="end"></lake-box></p>');
  });

  it('should insert an mention box using enter key', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    const event = new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    });
    editor.container.emit('keyup', event);
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('none');
    const value = removeBoxValueFromHTML(editor.getValue());
    expect(value).to.equal('<p><lake-box type="inline" name="mention" focus="end"></lake-box></p>');
  });

  it('should update items when backspace key is entered', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-mention-item').length).to.equal(1);
    editor.setValue('<p>@r<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-mention-item').length).to.equal(2);
  });

  it('should hide popup when the search result is empty', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-mention-item').length).to.equal(1);
    editor.setValue('<p>@roddy1<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('none');
  });

  it('should show popup when backspace key is entered', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-mention-item').length).to.equal(1);
    editor.setValue('<p>@roddy1<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('none');
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-mention-item').length).to.equal(1);
  });

  it('should show popup when delete key is entered', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-mention-item').length).to.equal(1);
    editor.setValue('<p>@roddy1<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('none');
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Delete',
    }));
    expect(editor.popupContainer.find('.lake-mention-popup').computedCSS('display')).to.equal('block');
    expect(editor.popupContainer.find('.lake-mention-item').length).to.equal(1);
  });

});
