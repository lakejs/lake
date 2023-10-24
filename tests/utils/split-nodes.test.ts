import { expect } from 'chai';
import { query, splitNodes } from '../../src/utils';

describe('utils.splitNodes()', () => {

  it('splits a text', () => {
    const container = query('<div><p><strong>onetwo</strong></p></div>');
    const parts = splitNodes(container.find('strong').first(), 3, container.find('p'));
    expect(container.html()).to.equal('<p><strong>one</strong><strong>two</strong></p>');
    expect(parts?.left.html()).to.equal('one');
    expect(parts?.right.html()).to.equal('two');
  });

  it('the position is at the beginning of the text', () => {
    const container = query('<div><p><strong>onetwo</strong></p></div>');
    const parts = splitNodes(container.find('strong').first(), 0, container.find('p'));
    expect(container.html()).to.equal('<p><strong></strong><strong>onetwo</strong></p>');
    expect(parts?.left.html()).to.equal('');
    expect(parts?.right.html()).to.equal('onetwo');
  });

  it('the position is at the end of the text', () => {
    const container = query('<div><p><strong>onetwo</strong></p></div>');
    const parts = splitNodes(container.find('strong').first(), 6, container.find('p'));
    expect(container.html()).to.equal('<p><strong>onetwo</strong><strong></strong></p>');
    expect(parts?.left.html()).to.equal('onetwo');
    expect(parts?.right.html()).to.equal('');
  });

  it('the position is in the empty mark', () => {
    const container = query('<div><p><strong></strong></p></div>');
    const parts = splitNodes(container.find('strong'), 0, container.find('p'));
    expect(container.html()).to.equal('<p><strong></strong><strong></strong></p>');
    expect(parts?.left.html()).to.equal('');
    expect(parts?.right.html()).to.equal('');
  });

  it('splits nested blocks', () => {
    const container = query('<div><blockquote><p>one<strong>two</strong>three</p></blockquote></div>');
    const parts = splitNodes(container.find('strong'), 0, container);
    expect(container.html()).to.equal('<blockquote><p>one<strong></strong></p></blockquote><blockquote><p><strong>two</strong>three</p></blockquote>');
    expect(parts?.left.html()).to.equal('<p>one<strong></strong></p>');
    expect(parts?.right.html()).to.equal('<p><strong>two</strong>three</p>');
  });

  it('splits no block when the node and the limit node are the same', () => {
    const container = query('<div><p><strong>onetwo</strong></p></div>');
    const parts = splitNodes(container.find('p'), 0, container.find('p'));
    expect(container.html()).to.equal('<p><strong>onetwo</strong></p>');
    expect(parts).to.equal(null);
  });

  it('splits a block when the node contains the limit node that is equivalent to no limit', () => {
    const container = query('<div><p><strong>onetwo</strong></p></div>');
    const parts = splitNodes(container.find('p'), 1, container.find('strong'));
    expect(container.html()).to.equal('<p></p>');
    expect(parts?.left.html()).to.equal('<div><p><strong>onetwo</strong></p></div>');
    expect(parts?.right.html()).to.equal('<div><p></p></div>');
  });

});
