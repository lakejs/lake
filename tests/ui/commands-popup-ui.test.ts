import { query } from '../../src/utils';
import { Range } from '../../src/models/range';
import { CommandsPopup } from '../../src/ui/commands-popup';
import { Editor } from '../../src';

describe('ui / commands-popup-ui', () => {

  it('commands popup', () => {
    const rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    const editor = new Editor({
      root: rootNode,
      value: '<p>/<focus /></p>',
    });
    editor.render();
    const popup = new CommandsPopup({
      editor,
    });
    const range = new Range();
    range.selectNodeContents(editor.container);
    popup.show(range);
    expect(editor.popupContainer.find('.lake-commands-popup').length).to.equal(1);
  });

});
