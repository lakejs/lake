import { query } from '../../src/utils';
import { Button } from '../../src/ui/button';
import { Nodes, icons } from '../../src';

describe('ui / button', () => {

  let rootNode: Nodes;

  beforeEach(()=> {
    rootNode = query('<div class="lake-button-root" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('should not add hovered class when button is selected', () => {
    const button = new Button({
      root: rootNode,
      name: 'bold',
      icon: icons.get('bold'),
      tooltip: 'Bold',
      onClick: () => {},
    });
    button.render();
    const buttonNode = button.node;
    buttonNode.addClass('lake-button-selected');
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    buttonNode.remove();
  });

});
