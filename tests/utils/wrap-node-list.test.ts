import { expect } from 'chai';
import { query, wrapNodeList } from '../../src/utils';

describe('utils.wrapNodeList()', () => {

  it('wrap nodes in paragraph', () => {
    const container = query('<div>one<strong>two</strong>three</div>');
    const block = wrapNodeList(container.children());
    expect(block.html()).to.equal('one<strong>two</strong>three');
    expect(container.html()).to.equal('<p>one<strong>two</strong>three</p>');
  });

  it('wrap nodes in list', () => {
    const container = query('<div>one<strong>two</strong>three</div>');
    wrapNodeList(container.children(), query('<ul><li></li></ul>'));
    expect(container.html()).to.equal('<ul><li>one<strong>two</strong>three</li></ul>');
  });

});
