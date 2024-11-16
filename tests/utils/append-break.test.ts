import { query } from '../../src/utils/query';
import { appendBreak } from '../../src/utils/append-break';

describe('utils / append-break', () => {

  it('should append a br to an empty block', () => {
    const element = query('<div><p></p></div>');
    appendBreak(element.find('p'));
    expect(element.html()).to.equal('<p><br></p>');
  });

  it('should not append a br to a block that already contains another br', () => {
    const element = query('<div><p><br /></p></div>');
    appendBreak(element.find('p'));
    expect(element.html()).to.equal('<p><br></p>');
  });

  it('should append a br to a block that contains a mark', () => {
    const element = query('<div><p><strong>foo</strong></p></div>');
    appendBreak(element.find('p'));
    expect(element.html()).to.equal('<p><strong>foo</strong><br></p>');
  });

  it('should append a br to a block that contains text', () => {
    const element = query('<div><p>foo</p></div>');
    appendBreak(element.find('p'));
    expect(element.html()).to.equal('<p>foo<br></p>');
  });

  it('should append a br to nested block', () => {
    const element = query('<div><ul><li></li></ul></div>');
    appendBreak(element.find('ul'));
    expect(element.html()).to.equal('<ul><li><br></li></ul>');
  });

  it('should append a br to a block that contains a bookmark', () => {
    const element = query('<div><p><lake-bookmark type="focus"></lake-bookmark></p></div>');
    appendBreak(element.find('p'));
    expect(element.html()).to.equal('<p><lake-bookmark type="focus"></lake-bookmark><br></p>');
  });

});
