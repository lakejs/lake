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
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(1);
    popup.hide();
    expect(editor.popupContainer.find('.lake-slash-popup').computedCSS('display')).to.equal('none');
    popup.show(range);
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(1);
    popup.unmount();
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(0);
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
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(0);
    editor.unmount();
  });

  it('update method: should search an item', () => {
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
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(0);
    editor.unmount();
  });

});
