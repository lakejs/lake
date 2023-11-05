import { expect } from 'chai';
import { query, fixNumberedList } from '../../src/utils';

describe('utils.fixNumberedList()', () => {

  it('adds start attributes', () => {
    const container = query('<div><ol><li>one</li></ol><ol><li>two</li></ol></div>');
    fixNumberedList(container.children());
    expect(container.html()).to.equal('<ol start="1"><li>one</li></ol><ol start="2"><li>two</li></ol>');
  });

  it('fixes wrong start attributes', () => {
    const container = query('<div><ol start="2"><li>one</li></ol><ol start="3"><li>two</li></ol></div>');
    fixNumberedList(container.children());
    expect(container.html()).to.equal('<ol start="1"><li>one</li></ol><ol start="2"><li>two</li></ol>');
  });

});