import { expect } from 'chai';
import { query, splitNodes } from '../../src/utils';

describe('utils.splitNodes()', () => {

  it('splits a text', () => {
    const container = query('<div><p><strong>onetwo</strong></p></div>');
    const parent = splitNodes(container.find('strong').first(), 3, container.find('p'));
    expect(container.html()).to.equal('<p><strong>one</strong><strong>two</strong></p>');
    expect(parent?.left.html()).to.equal('one');
    expect(parent?.right.html()).to.equal('two');
  });

  it('the position is at the beginning of the text', () => {
    const container = query('<div><p><strong>onetwo</strong></p></div>');
    const parent = splitNodes(container.find('strong').first(), 0, container.find('p'));
    expect(container.html()).to.equal('<p><strong></strong><strong>onetwo</strong></p>');
    expect(parent?.left.html()).to.equal('');
    expect(parent?.right.html()).to.equal('onetwo');
  });

  it('the position is at the end of the text', () => {
    const container = query('<div><p><strong>onetwo</strong></p></div>');
    const parent = splitNodes(container.find('strong').first(), 6, container.find('p'));
    expect(container.html()).to.equal('<p><strong>onetwo</strong><strong></strong></p>');
    expect(parent?.left.html()).to.equal('onetwo');
    expect(parent?.right.html()).to.equal('');
  });

  it('the position is in the empty mark', () => {
    const container = query('<div><p><strong></strong></p></div>');
    const parent = splitNodes(container.find('strong'), 0, container.find('p'));
    expect(container.html()).to.equal('<p><strong></strong><strong></strong></p>');
    expect(parent?.left.html()).to.equal('');
    expect(parent?.right.html()).to.equal('');
  });

  it('splits nested blocks', () => {
    const container = query('<div><h1><p>one<strong>two</strong>three</p></h1></div>');
    const parent = splitNodes(container.find('strong'), 0, container);
    expect(container.html()).to.equal('<h1><p>one<strong></strong></p></h1><h1><p><strong>two</strong>three</p></h1>');
    expect(parent?.left.html()).to.equal('<p>one<strong></strong></p>');
    expect(parent?.right.html()).to.equal('<p><strong>two</strong>three</p>');
  });

});
