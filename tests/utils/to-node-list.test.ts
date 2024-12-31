import { toNodeList } from '../../src/utils/to-node-list';

describe('utils / to-node-list', () => {

  it('a node', () => {
    const element = document.createElement('div');
    expect(toNodeList(element)[0]).to.equal(element);
  });

  it('a text string', () => {
    expect(toNodeList('<p>foo</p>', 'text')[0].nodeValue).to.equal('<p>foo</p>');
  });

  it('an HTML string: single tag', () => {
    expect((toNodeList('<p>foo</p>')[0] as Element).outerHTML).to.equal('<p>foo</p>');
  });

  it('an HTML string: multiple tags', () => {
    expect((toNodeList('<p>foo</p><p>bar</p>')[1] as Element).outerHTML).to.equal('<p>bar</p>');
  });

  it('a selector string: class', () => {
    const element = document.createElement('div');
    element.innerHTML = '<p class="class-p">foo</p><p class="class-p">bar</p>';
    document.body.appendChild(element);
    expect((toNodeList('.class-p')[0] as Element).outerHTML).to.equal('<p class="class-p">foo</p>');
    expect((toNodeList('.class-p')[1] as Element).outerHTML).to.equal('<p class="class-p">bar</p>');
    document.body.removeChild(element);
  });

  it('a selector string: id', () => {
    const element = document.createElement('div');
    element.innerHTML = '<p id="id-p">foo</p><p class="class-p">bar</p>';
    document.body.appendChild(element);
    expect((toNodeList('#id-p')[0] as Element).outerHTML).to.equal('<p id="id-p">foo</p>');
    document.body.removeChild(element);
  });

  it('an empty string', () => {
    expect(toNodeList('').length).to.equal(0);
  });

});
