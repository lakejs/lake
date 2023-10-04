import { expect } from 'chai';
import { query, removeZWS } from '../../src/utils';

describe('utils.removeZWS()', () => {

  it('should remove Zero-width spaces', () => {
    const container = query('<div><p><strong>foo\u200B</strong>ba\u200Br</p></div>');
    removeZWS(container);
    expect(container.html()).to.equal('<p><strong>foo</strong>bar</p>');
  });

  it('should not remove independent Zero-width spaces', () => {
    const container = query('<div><p><strong>\u200B</strong>\u200B</p></div>');
    removeZWS(container);
    expect(container.html()).to.equal('<p><strong>\u200B</strong>\u200B</p>');
  });

});
