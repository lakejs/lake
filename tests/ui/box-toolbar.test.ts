import { click } from '../utils';
import { boxes } from '../../src/storage/boxes';
import { icons } from '../../src/icons';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Box } from '../../src/models/box';
import { BoxToolbar } from '../../src/ui/box-toolbar';

const imageUrl = '../assets/images/heaven-lake-256.png';

describe('ui / box-toolbar', () => {

  let container: Nodes;
  let popupContainer: Nodes;

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      value: {
        url: imageUrl,
      },
      render: box => `<img src="${box.value.url}" style="width: 256px; height: 186px;" />`,
    });
    container = query('<div contenteditable="true"></div>');
    query(document.body).append(container);
    popupContainer = query('<div class="lake-popup lake-custom-properties"></div>');
    query(document.body).append(popupContainer);
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    container.remove();
    popupContainer.remove();
  });

  it('should add a toolbar', () => {
    container.html('<p><lake-box type="inline" name="inlineBox"></lake-box></p>');
    const box = new Box(container.find('lake-box'));
    box.render();
    let calledCount = 0;
    const boxToolbar = new BoxToolbar({
      root: popupContainer,
      box,
      items: [
        {
          name: 'open',
          type: 'button',
          icon: icons.get('open'),
          tooltip: 'Open',
          onClick: () => calledCount++,
        },
        '|',
        {
          name: 'remove',
          type: 'button',
          icon: icons.get('remove'),
          tooltip: 'Remove',
          onClick: () => calledCount++,
        },
      ],
    });
    boxToolbar.render();
    expect(query(document.body).find('.lake-box-toolbar').computedCSS('display')).to.equal('flex');
    click(query(document.body).find('.lake-box-toolbar button[name="open"]'));
    expect(calledCount).to.equal(1);
    click(query(document.body).find('.lake-box-toolbar button[name="remove"]'));
    expect(calledCount).to.equal(2);
    boxToolbar.unmount();
    expect(query(document.body).find('.lake-box-toolbar').length).to.equal(0);
  });

});
