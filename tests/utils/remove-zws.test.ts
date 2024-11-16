import { query } from '../../src/utils/query';
import { removeZWS } from '../../src/utils/remove-zws';

describe('utils / remove-zws', () => {

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

  it('should remove empty text', () => {
    const container = query('<div><p><strong>foo</strong></p></div>');
    container.find('p').append(document.createTextNode(''));
    removeZWS(container);
    expect(container.find('p').children().length).to.equal(1);
  });

});
