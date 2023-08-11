import { expect } from 'chai';
import { getFragment } from '../../src/utils';

describe('getFragment of utils', () => {
  it('a node', () => {
    const element = document.createElement('div');
    expect(getFragment(element).childNodes[0]).to.equal(element);
  });

  it('a text string', () => {
    expect(getFragment('<p>foo</p>', 'text').childNodes[0].nodeValue).to.equal('<p>foo</p>');
  });

  it('a HTML string', () => {
    expect(getFragment('<p>foo</p>').children[0].outerHTML).to.equal('<p>foo</p>');
    expect(getFragment('<p>foo</p>', 'html').children[0].outerHTML).to.equal('<p>foo</p>');
  });

  it('a selector string', () => {
    const element = document.createElement('div');
    element.innerHTML = '<p class="class-foo">foo</p><p class="class-bar">bar</p>';
    document.body.appendChild(element);
    expect(getFragment('.class-foo').children[0].outerHTML).to.equal('<p class="class-foo">foo</p>');
    expect(element.querySelector('.class-foo')).to.equal(null);
    expect(element.querySelector('.class-bar')).to.not.equal(null);
    document.body.removeChild(element);
  });
});
