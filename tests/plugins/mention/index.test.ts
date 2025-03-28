import { fakeXhr, FakeXMLHttpRequest } from 'nise';
import { query } from '@/utils/query';
import { Nodes } from '@/models/nodes';
import { Editor } from '@/editor';
import { MentionItem } from '@/plugins/mention/types';
import { click, removeBoxValueFromHTML } from '../../utils';

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

describe('plugins / mention / index', () => {

  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(() => {
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
    expect(editor.config.mention.getProfileUrl({ name: 'foo' })).to.equal('/foo');
  });

  it('should show a popup menu in an empty block', () => {
    editor.setValue('<p>@<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(4);
  });

  it('should show a popup menu after requesting data from server', () => {
    const xhr = fakeXhr.useFakeXMLHttpRequest();
    const requests: FakeXMLHttpRequest[] = [];
    xhr.onCreate = req => requests.push(req);
    editor.setPluginConfig('mention', {
      requestAction: '/mention.do',
      requestWithCredentials: true,
      requestHeaders: { foo: 'abc' },
      transformResponse: (body: any) => {
        return {
          data: body.users,
        };
      },
    });
    editor.setValue('<p>@<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(requests[0].withCredentials).to.equal(true);
    expect(requests[0].requestHeaders.foo).to.equal('abc');
    requests[0].respond(200, {}, JSON.stringify({
      users: mentionItems,
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(4);
  });

  it('should show a popup menu in a block that contains text', () => {
    editor.setValue('<p>foo @<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup.visible).to.equal(true);
  });

  it('should show a popup menu in a block that contains inline box', () => {
    editor.setValue('<p><lake-box type="inline" name="equation"></lake-box> foo @<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup.visible).to.equal(true);
  });

  it('should search for a custom item', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
  });

  it('should show a popup menu when there is no block', () => {
    editor.setValue('@<focus />');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup.visible).to.equal(true);
  });

  it('should not show a popup menu when there is no mention', () => {
    editor.setValue('<p>roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup).to.equal(null);
  });

  it('should not show a popup menu when the search result is empty', () => {
    editor.setValue('<p>@roddy2<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup).to.equal(null);
  });

  it('should insert an mention box by clicking', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    click(editor.popup.container.find('.lake-menu-item').eq(0));
    expect(editor.popup).to.equal(null);
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
    expect(editor.popup).to.equal(null);
    const value = removeBoxValueFromHTML(editor.getValue());
    expect(value).to.equal('<p><lake-box type="inline" name="mention" focus="end"></lake-box></p>');
  });

  it('should update items when backspace key is entered', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
    editor.setValue('<p>@r<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(2);
  });

  it('should hide a popup menu when the search result is empty', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
    editor.setValue('<p>@roddy1<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popup).to.equal(null);
  });

  it('should show a popup menu when backspace key is entered', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
    editor.setValue('<p>@roddy1<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popup).to.equal(null);
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
  });

  it('should show a popup menu when delete key is entered', () => {
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      shiftKey: true,
      key: '@',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
    editor.setValue('<p>@roddy1<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popup).to.equal(null);
    editor.setValue('<p>@roddy<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Delete',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
  });

});
