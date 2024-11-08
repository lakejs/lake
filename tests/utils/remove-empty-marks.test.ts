import { query, removeEmptyMarks } from '../../src/utils';

describe('utils / remove-empty-marks', () => {

  it('should remove empty marks', () => {
    const container = query('<div><p><strong>\u200B</strong><i></i>foo\u200B</p></div>');
    removeEmptyMarks(container);
    expect(container.html()).to.equal('<p>foo\u200B</p>');
  });

  it('should not remove marks containing text', () => {
    const container = query('<div><p><strong>foo\u200B</strong><i>bar</i></p></div>');
    removeEmptyMarks(container);
    expect(container.html()).to.equal('<p><strong>foo\u200B</strong><i>bar</i></p>');
  });

});
