import { query } from '../../src/utils';
import { Selection } from '../../src/managers/selection';
import { Command } from '../../src/managers/command';

describe('managers / command', () => {

  it('method: isDiabled', () => {
    const container = query('<div contenteditable="true" />');
    const selection = new Selection(container);
    const command = new Command(selection);
    command.add('bold', {
      isDisabled: () => true,
      execute: () => {},
    });
    command.add('align', {
      isDisabled: () => false,
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
      isSelected: () => false,
      execute: () => {},
    });
    expect(command.isSelected('bold')).to.equal(true);
    expect(command.isSelected('align')).to.equal(false);
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

});
