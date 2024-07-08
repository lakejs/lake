import { removeBreak, query } from '../../src/utils';

describe('utils / remove-break', () => {

  it('should remove br', () => {
    const element = query('<div><p><br /></p></div>');
    removeBreak(element.find('p'));
    expect(element.html()).to.equal('<p></p>');
  });

  it('should not remove br', () => {
    const element = query('<div><p>foo<br />bar</p></div>');
    removeBreak(element.find('p'));
    expect(element.html()).to.equal('<p>foo<br>bar</p>');
  });

  it('should remove br with empty text', () => {
    const element = query('<div><p><br /></p></div>');
    element.find('p').prepend(document.createTextNode(''));
    removeBreak(element.find('p'));
    expect(element.html()).to.equal('<p></p>');
  });

  it('should remove br with bookmark before it', () => {
    const element = query('<div><p><lake-bookmark type="focus"></lake-bookmark><br /></p></div>');
    removeBreak(element.find('p'));
    expect(element.html()).to.equal('<p><lake-bookmark type="focus"></lake-bookmark></p>');
  });

  it('should remove br with bookmark after it', () => {
    const element = query('<div><p><br /><lake-bookmark type="focus"></lake-bookmark></p></div>');
    removeBreak(element.find('p'));
    expect(element.html()).to.equal('<p><lake-bookmark type="focus"></lake-bookmark></p>');
  });

});
