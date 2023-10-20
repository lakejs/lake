import { expect } from 'chai';
import { query } from '../../src/utils';
import { Range } from '../../src/models';
import { getRightText } from '../../src/operations/get-right-text';

describe('operations.getRightText()', () => {

  it('the point is between the characters of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setEnd(container.find('strong').first(), 3);
    expect(getRightText(range)).to.equal('two');
  });

  it('the point is at the beginning of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setEnd(container.find('strong').first(), 0);
    expect(getRightText(range)).to.equal('onetwo');
  });

  it('the point is at the end of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setEnd(container.find('strong').first(), 6);
    expect(getRightText(range)).to.equal('');
  });

  it('should return the text of the closest block', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p><p>next block</p></div>');
    const range = new Range();
    range.setEnd(container.find('strong').first(), 6);
    expect(getRightText(range)).to.equal('');
  });

});
