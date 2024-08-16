import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Range } from '../../src/models/range';
import { SlashPopup } from '../../src/ui/slash-popup';
import { Editor } from '../../src';

describe('ui / slash-popup', () => {

  let rootNode: Nodes;

  beforeEach(()=> {
    rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('should show and hide popup', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const popup = new SlashPopup({
      editor,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    popup.show(range);
    expect(popup.visible).to.equal(true);
    const firstItem = editor.popupContainer.find('.lake-slash-item').eq(0);
    firstItem.emit('mouseenter');
    expect(firstItem.hasClass('lake-slash-item-selected')).to.equal(true);
    firstItem.emit('mouseleave');
    expect(firstItem.hasClass('lake-slash-item-selected')).to.equal(false);
    popup.hide();
    expect(popup.visible).to.equal(false);
    popup.show(range);
    expect(popup.visible).to.equal(true);
    popup.unmount();
    expect(popup.visible).to.equal(false);
    editor.unmount();
  });

  it('show method: should search an item', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const popup = new SlashPopup({
      editor,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    popup.show(range, 'code block');
    expect(editor.popupContainer.find('.lake-slash-item').length).to.equal(1);
    popup.unmount();
    editor.unmount();
  });

  it('update method: should update items', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const popup = new SlashPopup({
      editor,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    popup.show(range);
    expect(editor.popupContainer.find('.lake-slash-item').length > 1).to.equal(true);
    popup.update('code block');
    expect(editor.popupContainer.find('.lake-slash-item').length).to.equal(1);
    popup.unmount();
    editor.unmount();
  });

  it('search method: should search an item', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const popup = new SlashPopup({
      editor,
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
