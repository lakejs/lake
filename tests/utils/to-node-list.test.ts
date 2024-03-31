import { toNodeList } from '../../src/utils';

describe('utils / to-node-list', () => {

  it('is a node', () => {
    const element = document.createElement('div');
    expect(toNodeList(element)[0]).to.equal(element);
  });

  it('is a text string', () => {
    expect(toNodeList('<p>foo</p>', 'text')[0].nodeValue).to.equal('<p>foo</p>');
  });

  it('is a HTML string', () => {
    expect((toNodeList('<p>foo</p>')[0] as Element).outerHTML).to.equal('<p>foo</p>');
  });

  it('is a selector string: class', () => {
    const element = document.createElement('div');
    element.innerHTML = '<p class="class-p">foo</p><p class="class-p">bar</p>';
    document.body.appendChild(element);
    expect((toNodeList('.class-p')[0] as Element).outerHTML).to.equal('<p class="class-p">foo</p>');
    expect((toNodeList('.class-p')[1] as Element).outerHTML).to.equal('<p class="class-p">bar</p>');
    document.body.removeChild(element);
  });

  it('is a selector string: id', () => {
    const element = document.createElement('div');
    element.innerHTML = '<p id="id-p">foo</p><p class="class-p">bar</p>';
    document.body.appendChild(element);
    expect((toNodeList('#id-p')[0] as Element).outerHTML).to.equal('<p id="id-p">foo</p>');
    document.body.removeChild(element);
  });

  it('is an empty string', () => {
    expect(toNodeList('').length).to.equal(0);
  });

});
