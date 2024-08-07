import { query } from '../../src/utils';
import { SlashPopup } from '../../src/ui/slash-popup';
import { Editor } from '../../src';

describe('ui / slash-popup-ui', () => {

  it('slash popup', () => {
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
    const slashRange = editor.selection.range.clone();
    slashRange.selectNodeContents(editor.container);
    popup.show(slashRange);
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(1);
  });

});
