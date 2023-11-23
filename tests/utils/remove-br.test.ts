import { expect } from 'chai';
import { removeBr, query } from '../../src/utils';

describe('utils / remove-br', () => {

  it('should remove br', () => {
    const element = query('<div><p><br /></p></div>');
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p></p>');
  });

  it('should not remove br', () => {
    const element = query('<div><p>foo<br />bar</p></div>');
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p>foo<br>bar</p>');
  });

  it('with empty text', () => {
    const element = query('<div><p><br /></p></div>');
    element.find('p').prepend(document.createTextNode(''));
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p></p>');
  });

  it('with bookmark before br', () => {
    const element = query('<div><p><lake-bookmark type="focus"></lake-bookmark><br /></p></div>');
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p><lake-bookmark type="focus"></lake-bookmark></p>');
  });

  it('with bookmark after br', () => {
    const element = query('<div><p><br /><lake-bookmark type="focus"></lake-bookmark></p></div>');
    removeBr(element.find('p'));
    expect(element.html()).to.equal('<p><lake-bookmark type="focus"></lake-bookmark></p>');
  });

});
