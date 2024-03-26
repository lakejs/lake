import { appendDeepest, query } from '../../src/utils';

describe('utils / append-deepest', () => {

  it('should append a text', () => {
    const element = query('<div><p><strong></strong></p></div>');
    appendDeepest(element, query(document.createTextNode('foo')));
    expect(element.html()).to.equal('<p><strong>foo</strong></p>');
  });

  it('should not append text when the deepest node is a text node', () => {
    const element = query('<div><p>foo</p></div>');
    appendDeepest(element, query(document.createTextNode('bar')));
    expect(element.html()).to.equal('<p>foo</p>');
  });

  it('should not append text when the deepest node is a void element', () => {
    const element = query('<div><p><br></p></div>');
    appendDeepest(element, query(document.createTextNode('foo')));
    expect(element.html()).to.equal('<p><br></p>');
  });

  it('should not append text when the deepest node is a box', () => {
    const element = query('<div><p><lake-box type="inline" name="inlineBox"></lake-box></p></div>');
    appendDeepest(element, query(document.createTextNode('foo')));
    expect(element.html()).to.equal('<p><lake-box type="inline" name="inlineBox"></lake-box></p>');
  });

  it('should append a text when the deepest node is an empty text', () => {
    const element = query('<div><p><strong>\u200B</strong></p></div>');
    appendDeepest(element, query(document.createTextNode('foo')));
    expect(element.html()).to.equal('<p><strong>\u200Bfoo</strong></p>');
  });

});
