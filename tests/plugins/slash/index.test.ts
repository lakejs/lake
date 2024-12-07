import sinon from 'sinon';
import { icons } from 'lakelib/icons';
import { debug } from 'lakelib/utils/debug';
import { query } from 'lakelib/utils/query';
import { getBox } from 'lakelib/utils/get-box';
import { Nodes } from 'lakelib/models/nodes';
import { Editor } from 'lakelib/editor';
import { SlashItem } from 'lakelib/plugins/slash/types';
import { click, removeBoxValueFromHTML, base64ToArrayBuffer } from '../../utils';

const imgBuffer = base64ToArrayBuffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/orejrsAAAAASUVORK5CYII=');

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

describe('plugins / slash / index', () => {

  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(()=> {
    rootNode = query('<div class="lake-editor"><div class="lake-root"></div></div>');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode.find('.lake-root'),
      value: '<p><br /><focus /></p>',
      slash: {
        items: slashItems,
      },
    });
    editor.render();
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should return correct config', () => {
    expect(editor.config.slash.items).to.deep.equal(slashItems);
  });

  it('should show a popup menu', () => {
    editor.setValue('<p>/<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popup.visible).to.equal(true);
  });

  it('should search for a custom item', () => {
    editor.setValue('<p>/bold<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
  });

  it('should not show a popup menu when there is no block', () => {
    editor.setValue('/<focus />');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popup).to.equal(null);
  });

  it('should not show a popup box when the block contains a box', () => {
    editor.setValue('<p>/<focus /><lake-box type="inline" name="equation"></lake-box></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popup).to.equal(null);
  });

  it('should not show a popup box when the cursor is within a table', () => {
    editor.setValue('<table><tr><td><p>/<focus /></p></td></tr></table>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popup).to.equal(null);
  });

  it('should not show a popup menu when there is no slash', () => {
    editor.setValue('<p>code<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'e',
    }));
    expect(editor.popup).to.equal(null);
  });

  it('should not show a popup box when the search result is empty', () => {
    editor.setValue('<p>//<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popup).to.equal(null);
  });

  it('should set current block to heading 1', () => {
    editor.setValue('<p>/heading<focus /></p>');
    const event = new KeyboardEvent('keyup', {
      key: '/',
    });
    editor.container.emit('keyup', event);
    click(editor.popup.container.find('.lake-menu-item').eq(0));
    expect(editor.popup).to.equal(null);
    const value = editor.getValue();
    expect(value).to.equal('<h1><focus /><br /></h1>');
  });

  it('should set current block to heading 1 using enter key', () => {
    editor.setValue('<p>/heading<focus /></p>');
    const event = new KeyboardEvent('keyup', {
      key: '/',
    });
    editor.container.emit('keyup', event);
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
    }));
    expect(editor.popup).to.equal(null);
    const value = editor.getValue();
    expect(value).to.equal('<h1><focus /><br /></h1>');
  });

  it('should set current block to heading 6', () => {
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    click(editor.popup.container.find('.lake-menu-item').eq(0));
    expect(editor.popup).to.equal(null);
    const value = editor.getValue();
    expect(value).to.equal('<h6><focus /><br /></h6>');
  });

  it('should insert an equation', () => {
    editor.setValue('<p>/formula<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    click(editor.popup.container.find('.lake-menu-item').eq(0));
    expect(editor.popup).to.equal(null);
    const value = editor.getValue();
    expect(value).to.equal('<p><lake-box type="inline" name="equation" focus="end"></lake-box></p>');
  });

  it('should remove marks', () => {
    editor.setValue('<p><strong>/heading 6<focus /></strong></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    click(editor.popup.container.find('.lake-menu-item').eq(0));
    expect(editor.popup).to.equal(null);
    const value = editor.getValue();
    expect(value).to.equal('<h6><focus /><br /></h6>');
  });

  it('should update items when backspace key is entered', () => {
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
    editor.setValue('<p>/heading <focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(6);
  });

  it('should hide popup menu when the search result is empty', () => {
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
    editor.setValue('<p>/heading 61<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popup).to.equal(null);
  });

  it('should show popup menu when backspace key is entered', () => {
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
    editor.setValue('<p>/heading 61<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popup).to.equal(null);
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Backspace',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
  });

  it('should show popup menu when delete key is entered', () => {
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
    editor.setValue('<p>/heading 61<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '1',
    }));
    expect(editor.popup).to.equal(null);
    editor.setValue('<p>/heading 6<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: 'Delete',
    }));
    expect(editor.popup.visible).to.equal(true);
    expect(editor.popup.container.find('.lake-menu-item').length).to.equal(1);
  });

  it('image: should upload images', () => {
    const xhr = sinon.useFakeXMLHttpRequest();
    const requests: sinon.SinonFakeXMLHttpRequest[] = [];
    xhr.onCreate = req => requests.push(req);
    const files = [
      new File([imgBuffer], 'heaven-lake-512.png', {
        type: 'image/png',
      }),
      new File([imgBuffer], 'lac-gentau-256.jpg', {
        type: 'image/png',
      }),
    ];
    const event = {
      ...new Event('change'),
      target: {
        ...new EventTarget(),
        files,
      },
    };
    editor.setValue('<p>/<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    editor.popup.container.find('[name="image"]').find('input[type="file"]').emit('change', event as Event);
    requests[0].respond(200, {}, JSON.stringify({
      url: '../assets/images/heaven-lake-512.png',
    }));
    requests[1].respond(200, {}, JSON.stringify({
      url: '../assets/images/lac-gentau-256.jpg',
    }));
    xhr.restore();
    const value = removeBoxValueFromHTML(editor.getValue());
    debug(`output: ${value}`);
    expect(value).to.equal('<p><lake-box type="inline" name="image"></lake-box><lake-box type="inline" name="image" focus="end"></lake-box></p>');
    const box1 = getBox(editor.container.find('lake-box').eq(0));
    const box2 = getBox(editor.container.find('lake-box').eq(1));
    expect(box1.value.status).to.equal('done');
    expect(box1.value.url).to.equal('../assets/images/heaven-lake-512.png');
    expect(box2.value.status).to.equal('done');
    expect(box2.value.url).to.equal('../assets/images/lac-gentau-256.jpg');
  });

  it('file: should upload files', () => {
    const xhr = sinon.useFakeXMLHttpRequest();
    const requests: sinon.SinonFakeXMLHttpRequest[] = [];
    xhr.onCreate = req => requests.push(req);
    const files = [
      new File([imgBuffer], 'heaven-lake-64.png', {
        type: 'image/png',
      }),
      new File(['foo'], 'heaven-lake-wikipedia.pdf', {
        type: 'application/pdf',
      }),
    ];
    const event = {
      ...new Event('change'),
      target: {
        ...new EventTarget(),
        files,
      },
    };
    editor.setValue('<p>/<focus /></p>');
    editor.container.emit('keyup', new KeyboardEvent('keyup', {
      key: '/',
    }));
    editor.popup.container.find('[name="file"]').find('input[type="file"]').emit('change', event as Event);
    requests[0].respond(200, {}, JSON.stringify({
      url: '../assets/images/heaven-lake-64.png',
    }));
    requests[1].respond(200, {}, JSON.stringify({
      url: '../assets/files/heaven-lake-wikipedia.pdf',
    }));
    xhr.restore();
    const value = removeBoxValueFromHTML(editor.getValue());
    debug(`output: ${value}`);
    expect(value).to.equal('<p><lake-box type="inline" name="file"></lake-box><lake-box type="inline" name="file" focus="end"></lake-box></p>');
    const box1 = getBox(editor.container.find('lake-box').eq(0));
    const box2 = getBox(editor.container.find('lake-box').eq(1));
    expect(box1.value.status).to.equal('done');
    expect(box1.value.url).to.equal('../assets/images/heaven-lake-64.png');
    expect(box2.value.status).to.equal('done');
    expect(box2.value.url).to.equal('../assets/files/heaven-lake-wikipedia.pdf');
  });

});
