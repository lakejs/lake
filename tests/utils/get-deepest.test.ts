import { getDeepest, query } from '../../src/utils';

describe('utils / get-deepest', () => {

  it('should return strong', () => {
    const element = query('<div><p><strong></strong></p></div>');
    expect(getDeepest(element).name).to.equal('strong');
  });

  it('should not return element', () => {
    const element = query('<div><p>foo</p></div>');
    expect(getDeepest(element).name).to.equal('');
  });

  it('should not return element when the deepest node is void', () => {
    const element = query('<div><p><br></p></div>');
    expect(getDeepest(element).name).to.equal('');
  });

  it('should return element when the deepest node is an empty text', () => {
    const element = query('<div><p><strong>\u200B</strong></p></div>');
    expect(getDeepest(element).name).to.equal('strong');
  });

});
