import { expect } from 'chai';
import { query } from '../../src/utils';
import { Range } from '../../src/models';
import { getLeftText } from '../../src/operations/get-left-text';

describe('operations / get-left-text', () => {

  it('the point is between the characters of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 3);
    expect(getLeftText(range)).to.equal('one');
  });

  it('the point is at the beginning of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 0);
    expect(getLeftText(range)).to.equal('');
  });

  it('the point is at the end of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 6);
    expect(getLeftText(range)).to.equal('onetwo');
  });

  it('should return the text of the closest block', () => {
    const container = query('<div contenteditable="true"><p>previous block</p><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 0);
    expect(getLeftText(range)).to.equal('');
  });

});
