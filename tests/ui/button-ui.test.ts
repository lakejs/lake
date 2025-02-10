import { click } from '../utils';
import { query } from '../../src/utils/query';
import { Button } from '../../src/ui/button';
import { Nodes, icons } from '../../src';

describe('ui / button-ui', () => {

  let rootNode: Nodes;

  before(() => {
    rootNode = query('<div class="lake-button-root lake-ui-test" />');
    query(document.body).append(rootNode);
  });

  it('icon button', () => {
    let buttonValue;
    const button = new Button({
      root: rootNode,
      name: 'bold',
      icon: icons.get('bold'),
      tooltip: 'Bold',
      onClick: () => {
        buttonValue = 'bold clicked';
      },
    });
    button.render();
    const buttonNode = button.node;
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(true);
    buttonNode.emit('mouseleave');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    click(buttonNode);
    expect(buttonValue).to.equal('bold clicked');
  });

  it('text button without icon', () => {
    let buttonValue;
    const button = new Button({
      root: rootNode,
      name: 'save',
      text: 'Save',
      tooltip: 'Save',
      onClick: () => {
        buttonValue = 'save clicked';
      },
    });
    button.render();
    const buttonNode = button.node;
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(true);
    buttonNode.emit('mouseleave');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    click(buttonNode);
    expect(buttonValue).to.equal('save clicked');
  });

  it('text button with icon', () => {
    let buttonValue;
    const button = new Button({
      root: rootNode,
      name: 'save',
      icon: icons.get('check'),
      text: 'Save',
      tooltip: 'Save',
      onClick: () => {
        buttonValue = 'save clicked';
      },
    });
    button.render();
    const buttonNode = button.node;
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(true);
    buttonNode.emit('mouseleave');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    click(buttonNode);
    expect(buttonValue).to.equal('save clicked');
  });

  it('primary button', () => {
    let buttonValue;
    const button = new Button({
      root: rootNode,
      name: 'save',
      type: 'primary',
      text: 'Save',
      tooltip: 'Save',
      onClick: () => {
        buttonValue = 'save clicked';
      },
    });
    button.render();
    const buttonNode = button.node;
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(true);
    buttonNode.emit('mouseleave');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    click(buttonNode);
    expect(buttonValue).to.equal('save clicked');
  });

});
