import { expect } from 'chai';
import { Command } from '../../src/models';

describe('models.Command class', () => {

  it('should execute correct command', () => {
    const command = new Command();
    let status = 'none';
    command.add('bold', () => {
      status = 'bold';
    });
    command.add('align', type => {
      status = `align: ${type}`;
    });
    command.execute('bold');
    expect(status).to.equal('bold');
    command.execute('align', 'center');
    expect(status).to.equal('align: center');
  });

});