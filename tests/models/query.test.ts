import { expect } from 'chai';
import { query } from '../../src/models';

describe('query of models', () => {
  it('a node', () => {
    const element = document.createElement('div');
    expect(query(element).get(0)).to.equal(element);
  });

  it('a HTML string', () => {
    expect(query('<div><p>foo</p><p>bar</p></div>').html()).to.equal('<p>foo</p><p>bar</p>');
  });

  it('a selector string', () => {
    const elementList = query('<div><p class="class-p">foo</p><p class="class-p">bar</p></div>');
    elementList.appendTo(document.body);
    expect(query('body .class-p').html()).to.equal('foo');
    expect(query('body .class-p').eq(1).html()).to.equal('bar');
    elementList.remove();
  });
});
