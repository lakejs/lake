import { query } from '../../src/utils/query';

describe('utils / query', () => {

  it('is a native element', () => {
    const element = document.createElement('div');
    expect(query(element).get(0)).to.equal(element);
  });

  it('is a native text node', () => {
    const textNode = document.createTextNode('foo');
    expect(query(textNode).get(0)).to.equal(textNode);
  });

  it('is an instance of Nodes', () => {
    const element = query('<div>foo</div>');
    expect(query(element)).to.equal(element);
  });

  it('is an HTML string', () => {
    expect(query('<div><p>foo</p><p>bar</p></div>').html()).to.equal('<p>foo</p><p>bar</p>');
  });

  it('is a selector string', () => {
    const nodes = query('<div><p class="class-p">foo</p><p class="class-p">bar</p></div>');
    query(document.body).append(nodes);
    expect(query('body .class-p').html()).to.equal('foo');
    expect(query('body .class-p').eq(1).html()).to.equal('bar');
    nodes.remove();
  });

});
