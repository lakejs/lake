import { expect } from 'chai';
import { query, getRightText } from '../../src/utils';

describe('utils.getRightText()', () => {

  it('the point is between the characters of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    expect(getRightText(container.find('strong').first(), 3)).to.equal('two');
  });

  it('the point is at the beginning of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    expect(getRightText(container.find('strong').first(), 0)).to.equal('onetwo');
  });

  it('the point is at the end of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    expect(getRightText(container.find('strong').first(), 6)).to.equal('');
  });

  it('should return the text of the closest block', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p><p>next block</p></div>');
    expect(getRightText(container.find('strong').first(), 6)).to.equal('');
  });

});
