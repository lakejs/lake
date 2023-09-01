import { expect } from 'chai';
import { query } from '../../src/utils';

describe('utils.query()', () => {

  it('native element', () => {
    const element = document.createElement('div');
    expect(query(element).get(0)).to.equal(element);
  });

  it('native text node', () => {
    const textNode = document.createTextNode('foo');
    expect(query(textNode).get(0)).to.equal(textNode);
  });

  it('instance of Nodes', () => {
    const element = query('<div>foo</div>');
    expect(query(element)).to.equal(element);
  });

  it('HTML string', () => {
    expect(query('<div><p>foo</p><p>bar</p></div>').html()).to.equal('<p>foo</p><p>bar</p>');
  });

  it('selector string', () => {
    const nodes = query('<div><p class="class-p">foo</p><p class="class-p">bar</p></div>');
    nodes.appendTo(document.body);
    expect(query('body .class-p').html()).to.equal('foo');
    expect(query('body .class-p').eq(1).html()).to.equal('bar');
    nodes.remove();
  });

});
