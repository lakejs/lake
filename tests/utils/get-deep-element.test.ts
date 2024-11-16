import { query } from '../../src/utils/query';
import { getDeepElement } from '../../src/utils/get-deep-element';

describe('utils / get-deep-element', () => {

  it('should return strong', () => {
    const element = query('<div><p><strong></strong></p></div>');
    expect(getDeepElement(element).name).to.equal('strong');
  });

  it('should not return element', () => {
    const element = query('<div><p>foo</p></div>');
    expect(getDeepElement(element).name).to.equal('');
  });

  it('should not return element when the deepest node is void', () => {
    const element = query('<div><p><br></p></div>');
    expect(getDeepElement(element).name).to.equal('');
  });

  it('should return element when the deepest node is an empty text', () => {
    const element = query('<div><p><strong>\u200B</strong></p></div>');
    expect(getDeepElement(element).name).to.equal('strong');
  });

});
