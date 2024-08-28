import { query } from '../../src/utils';
import { SlashPopup } from '../../src/ui/slash-popup';
import { Editor } from '../../src';

const slashItems: string[] = [
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
      items: slashItems,
    });
    const slashRange = editor.selection.range.clone();
    slashRange.selectNodeContents(editor.container);
    popup.show(slashRange);
    expect(editor.popupContainer.find('.lake-slash-popup').length).to.equal(1);
  });

});
