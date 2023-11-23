import { expect } from 'chai';
import { query } from '../../src/utils';
import { Range } from '../../src/models/range';
import { removeLeftText } from '../../src/operations/remove-left-text';

describe('operations / remove-left-text', () => {

  it('the point is between the characters of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 3);
    removeLeftText(range);
    expect(container.html()).to.equal('<p><strong>two</strong></p>');
  });

  it('the point is at the beginning of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 0);
    removeLeftText(range);
    expect(container.html()).to.equal('<p><strong>onetwo</strong></p>');
  });

  it('the point is at the end of the text', () => {
    const container = query('<div contenteditable="true"><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 6);
    removeLeftText(range);
    expect(container.html()).to.equal('<p><strong></strong></p>');
  });

  it('should remove the text of the closest block', () => {
    const container = query('<div contenteditable="true"><p>previous block</p><p><strong>onetwo</strong></p></div>');
    const range = new Range();
    range.setStart(container.find('strong').first(), 3);
    removeLeftText(range);
    expect(container.html()).to.equal('<p>previous block</p><p><strong>two</strong></p>');
  });

});
