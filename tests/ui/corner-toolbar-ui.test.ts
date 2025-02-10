import { click } from '../utils';
import { query } from '../../src/utils/query';
import { CornerToolbar } from '../../src/ui/corner-toolbar';
import { Nodes, icons } from '../../src';

describe('ui / corner-toolbar-ui', () => {

  let rootNode: Nodes;

  before(() => {
    rootNode = query('<div class="lake-corner-toolbar-root lake-ui-test" style="position:relative;" />');
    query(document.body).append(rootNode);
  });

  it('corner toolbar', () => {
    let buttonValue;
    const cornerToolbar = new CornerToolbar({
      root: rootNode,
      items: [
        {
          name: 'view',
          icon: icons.get('maximize'),
          tooltip: 'Full screen',
          onClick: () => {
            buttonValue = 'view clicked';
          },
        },
        {
          name: 'remove',
          icon: icons.get('remove'),
          tooltip: 'Remove',
          onClick: () => {
            buttonValue = 'remove clicked';
          },
        },
      ],
    });
    cornerToolbar.render();
    cornerToolbar.container.show();
    click(cornerToolbar.container.find('button[name="remove"]'));
    expect(buttonValue).to.equal('remove clicked');
  });

});
