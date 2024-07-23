import { query } from '../../src/utils';
import { Selection } from '../../src/managers/selection';
import { Command } from '../../src/managers/command';

describe('managers / command', () => {

  it('method: add / delete', () => {
    const container = query('<div contenteditable="true" />');
    const selection = new Selection(container);
    const command = new Command(selection);
    command.add('bold', {
      execute: () => {},
    });
    command.delete('bold');
    expect(command.has('bold')).to.deep.equal(false);
  });

  it('method: getNames', () => {
    const container = query('<div contenteditable="true" />');
    const selection = new Selection(container);
    const command = new Command(selection);
    command.add('bold', {
      execute: () => {},
    });
    command.add('align', {
      execute: () => {},
    });
    expect(command.getNames()).to.deep.equal(['bold', 'align']);
  });

  it('method: has', () => {
    const container = query('<div contenteditable="true" />');
    const selection = new Selection(container);
    const command = new Command(selection);
    command.add('bold', {
      execute: () => {},
    });
    command.add('align', {
      execute: () => {},
    });
    expect(command.has('bold')).to.equal(true);
    expect(command.has('italic')).to.equal(false);
  });

  it('method: getItem', () => {
    const container = query('<div contenteditable="true" />');
    const selection = new Selection(container);
    const command = new Command(selection);
    const item = {
      execute: () => {},
    };
    command.add('bold', item);
    expect(command.getItem('bold')).to.equal(item);
  });

  it('method: isDiabled', () => {
    const container = query('<div contenteditable="true" />');
    const selection = new Selection(container);
    const command = new Command(selection);
    command.add('bold', {
      isDisabled: () => true,
      execute: () => {},
    });
    command.add('align', {
      execute: () => {},
    });
    expect(command.isDisabled('bold')).to.equal(true);
    expect(command.isDisabled('align')).to.equal(false);
  });

  it('method: isSelected', () => {
    const container = query('<div contenteditable="true" />');
    const selection = new Selection(container);
    const command = new Command(selection);
    command.add('bold', {
      isSelected: () => true,
      execute: () => {},
    });
    command.add('align', {
      execute: () => {},
    });
    expect(command.isSelected('bold')).to.equal(true);
    expect(command.isSelected('align')).to.equal(false);
  });

  it('method: selectedValues', () => {
    const container = query('<div contenteditable="true" />');
    const selection = new Selection(container);
    const command = new Command(selection);
    command.add('heading', {
      selectedValues: () => ['h3'],
      execute: () => {},
    });
    command.add('align', {
      execute: () => {},
    });
    expect(command.selectedValues('heading')).to.deep.equal(['h3']);
    expect(command.selectedValues('align').length).to.equal(0);
  });

  it('method: execute', () => {
    const container = query('<div contenteditable="true" />');
    const selection = new Selection(container);
    const command = new Command(selection);
    let status = 'none';
    command.add('bold', {
      execute: () => {
        status = 'bold';
      },
    });
    command.add('align', {
      execute: type => {
        status = `align: ${type}`;
      },
    });
    command.execute('bold');
    expect(status).to.equal('bold');
    command.execute('align', 'center');
    expect(status).to.equal('align: center');
  });

  it('the selection should be moved to the end of the content', () => {
    const container = query('<div contenteditable="true" />');
    container.html('foo');
    const selection = new Selection(container);
    const command = new Command(selection);
    command.add('bold', {
      execute: () => {},
    });
    command.execute('bold');
    expect(selection.range.startNode.get(0)).to.equal(container.get(0));
    expect(selection.range.startOffset).to.equal(1);
  });

});
