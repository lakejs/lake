import { query } from '../../src/utils';
import { Range } from '../../src/models/range';
import { SlashPopup } from '../../src/ui/slash-popup';
import { Editor } from '../../src';

describe('ui / slash-popup', () => {

  it('should remove popup', () => {
    const rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
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
    popup.unmount();
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(0);
  });

});
