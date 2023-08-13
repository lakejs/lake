import { expect } from 'chai';
import { getNodeList } from '../../src/utils';
import { NativeElement } from '../../src/types/native';

describe('getNodeList of utils', () => {
  it('a node', () => {
    const element = document.createElement('div');
    expect(getNodeList(element)[0]).to.equal(element);
  });

  it('a text string', () => {
    expect(getNodeList('<p>foo</p>', 'text')[0].nodeValue).to.equal('<p>foo</p>');
  });

  it('a HTML string', () => {
    expect((getNodeList('<p>foo</p>')[0] as NativeElement).outerHTML).to.equal('<p>foo</p>');
  });

  it('a selector string: class', () => {
    const element = document.createElement('div');
    element.innerHTML = '<p class="class-p">foo</p><p class="class-p">bar</p>';
    document.body.appendChild(element);
    expect((getNodeList('.class-p')[0] as NativeElement).outerHTML).to.equal('<p class="class-p">foo</p>');
    expect((getNodeList('.class-p')[1] as NativeElement).outerHTML).to.equal('<p class="class-p">bar</p>');
    document.body.removeChild(element);
  });

  it('a selector string: id', () => {
    const element = document.createElement('div');
    element.innerHTML = '<p id="id-p">foo</p><p class="class-p">bar</p>';
    document.body.appendChild(element);
    expect((getNodeList('#id-p')[0] as NativeElement).outerHTML).to.equal('<p id="id-p">foo</p>');
    document.body.removeChild(element);
  });
});
